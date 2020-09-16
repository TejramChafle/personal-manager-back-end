var express     = require('express');
var mongoose    = require('mongoose');
var Contractor     = require('../models/Contractor');
const auth      = require('../auth');

var router      = express.Router();

/**
 * @swagger
 * /contractor:
 *   get:
 *     tags:
 *       - Contractor
 *     description: Returns all contractors
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of contractors
 */
// GET CONTRACTORS (Only active) WITH filter & pagination
router.get('/', auth, (req, resp) => {
    Contractor.where({ is_active: true }).exec().then(contractors => {
        return resp.status(200).json(contractors);
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
 * /contractor/{id}:
 *   get:
 *     tags:
 *       - Contractor
 *     description: Returns a single contractor
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Contractor's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single contractor
 */

// GET SINGLE CONTRACTOR BY ID
router.get('/:id', auth, (req, resp, next) => {
    Contractor.findById(req.params.id).exec().then(contractor => {
        return resp.status(200).json(contractor);
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
 * /contractor:
 *   post:
 *     tags:
 *       - Contractor
 *     description: Creates a new contractor
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: contractor
 *         description: Contractor object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Contractor'
 *     responses:
 *       201:
 *         description: Contractor created successfully
 */
// SAVE CONTRACTOR
router.post('/', auth, (req, resp, next) => {
    // First check if the contractor with client id and name already exists.
    Contractor.findOne({ name: req.body.name, client_id: req.body.client_id, is_active: true })
        .exec()
        .then(contractor => {
            // If the contractor with client id and name already exists, then return error
            if (contractor) {
                // 409 : Conflict. The request could not be completed because of a conflict.
                return resp.status(409).json({
                    message: "This contractor with name " + req.body.name + " with this client already exist."
                });
            } else {
                // Since the contractor doesn't exist, then save the detail
                console.log(req.body);
                const contractor = new Contractor({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    address: req.body.address,
                    contact_person: req.body.contact_person,
                    client_id: req.body.client_id,
                    email: req.body.email,
                    phone: req.body.phone,
                    mobile: req.body.mobile,
                    description: req.body.description,
                    created_by: req.body.created_by,
                    updated_by: req.body.updated_by,
                    created_date: Date.now(),
                    updated_date: Date.now()
                });

                contractor.save()
                    .then(result => {
                        console.log(result);
                        return resp.status(201).json({
                            message: "Contractor created successfully",
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
* /contractor/{id}:
*   put:
*     tags:
*       - Contractor
*     description: Updates a single contractor
*     produces: application/json
*     parameters:
*       name: contractor
*       in: body
*       description: Fields for the Contractor resource
*       schema:
*         type: array
*         $ref: '#/definitions/Contractor'
*     responses:
*       200:
*         description: Successfully updated
*/
// UPDATE CONTRACTOR
router.put('/:id', auth, (req, resp, next) => {
    Contractor.findByIdAndUpdate(req.params.id, req.body).exec().then(contractor => {
        return resp.status(200).json(contractor);
    }).catch(error => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});


/**
 * @swagger
 * /contractor/{id}:
 *   delete:
 *     tags:
 *       - Contractor
 *     description: Deletes a single contractor
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Contractor's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
// DELETE CONTRACTOR (Hard delete. This will delete the entire contractor detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp, next) => {
    Contractor.findByIdAndRemove(req.params.id).exec().then(contractor => {
        return resp.status(200).json(contractor);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});

module.exports = router;
