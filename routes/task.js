var express     = require('express');
var mongoose    = require('mongoose');
var Client     = require('../models/Client');
const auth      = require('../auth');

var router      = express.Router();

/**
 * @swagger
 * /client:
 *   get:
 *     tags:
 *       - Client
 *     description: Returns all clients
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of clients
 */
// GET CLIENTS (Only active) WITH filter & pagination
router.get('/', auth, (req, resp) => {
    /* Client.where({ is_active: true }).exec().then(clients => {
        return resp.status(200).json(clients);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    }); */

    let filter = {};
    filter.is_active = req.query.is_active || true;
    if (req.query.name) filter.name = new RegExp('.*' + req.query.name + '.*', 'i');
    if (req.query.contact_person) filter.contact_person = req.query.contact_person;
    if (req.query.phone) filter.phone = new RegExp('.*' + req.query.phone + '.*', 'i');
    if (req.query.email) filter.email = new RegExp('.*' + req.query.email + '.*', 'i');

    Client.paginate(filter, { sort: { _id: req.query.sort_order }, page: parseInt(req.query.page), limit: parseInt(req.query.limit), populate: ['contact_person', 'created_by', 'updated_by'] }, (error, result) => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        if (error) return resp.status(500).json({
            error: error
        });

        return resp.status(200).json(result);
    });
});


/**
 * @swagger
 * /client/{id}:
 *   get:
 *     tags:
 *       - Client
 *     description: Returns a single client
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Client's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single client
 */

// GET SINGLE CLIENT BY ID
router.get('/:id', auth, (req, resp, next) => {
    Client.findById(req.params.id).exec().then(client => {
        return resp.status(200).json(client);
    }).catch(error => {
        console.log('error : ', error);
        // 204 : No content. There is no content to send for this request, but the headers may be useful.
        return resp.status(204).json({
            error: error
        });
    });
});


/**
 * @swagger
 * /client:
 *   post:
 *     tags:
 *       - Client
 *     description: Creates a new client
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: client
 *         description: Client object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Client'
 *     responses:
 *       201:
 *         description: Client created successfully
 */
// SAVE CLIENT
router.post('/', auth, (req, resp, next) => {
    // First check if the conact with name and address already exists.
    Client.findOne({ firstname: req.body.name, address: req.body.address, is_active: true })
        .exec()
        .then(client => {
            // If the client with name and address already exists, then return error
            if (client) {
                // 409 : Conflict. The request could not be completed because of a conflict.
                return resp.status(409).json({
                    message: "The client with name " + req.body.name + " and address " + req.body.address + " already exist."
                });
            } else {
                // Since the client doesn't exist, then save the detail
                console.log(req.body);
                const client = new Client({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    contact_person: req.body.contact_person,
                    address: req.body.address,
                    email: req.body.email,
                    phone: req.body.phone,
                    mobile: req.body.mobile,
                    description: req.body.description,
                    created_by: req.body.created_by,
                    updated_by: req.body.updated_by,
                    created_date: Date.now(),
                    updated_date: Date.now()
                });

                client.save()
                    .then(result => {
                        console.log(result);
                        return resp.status(201).json({
                            message: "Client created successfully",
                            result: result
                        });
                    })
                    .catch(error => {
                        console.log('error : ', error);
                        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
                        return resp.status(500).json({
                            error: error
                        });
                    });
            }
        }).catch(error => {
            console.log('error : ', error);
            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
            return resp.status(500).json({
                error: error
            });
        });
});

/**
* @swagger
* /client/{id}:
*   put:
*     tags:
*       - Client
*     description: Updates a single client
*     produces: application/json
*     parameters:
*       name: client
*       in: body
*       description: Fields for the Client resource
*       schema:
*         type: array
*         $ref: '#/definitions/Client'
*     responses:
*       200:
*         description: Successfully updated
*/
// UPDATE CLIENT
router.put('/:id', auth, (req, resp, next) => {
    Client.findByIdAndUpdate(req.params.id, req.body).exec().then(client => {
        return resp.status(200).json(client);
    }).catch(error => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});


/**
 * @swagger
 * /client/{id}:
 *   delete:
 *     tags:
 *       - Client
 *     description: Deletes a single client
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Client's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
// DELETE CLIENT (Hard delete. This will delete the entire client detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp, next) => {
    Client.findByIdAndRemove(req.params.id).exec().then(client => {
        return resp.status(200).json(client);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});

module.exports = router;
