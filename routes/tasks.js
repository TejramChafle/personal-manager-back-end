const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const auth = require('../auth');
const router = express.Router();

/**
 * @swagger
 * /client:
 *   get:
 *     tags:
 *       - Task
 *     description: Returns all tasks
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of tasks
 */
// GET tasks (Only active) WITH filter & pagination
router.get('/', auth, (req, resp) => {
    /* Task.where({ is_active: true }).exec().then(tasks => {
        return resp.status(200).json(tasks);
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

    Task.paginate(filter, { sort: { _id: req.query.sort_order }, page: parseInt(req.query.page), limit: parseInt(req.query.limit), populate: ['contact_person', 'created_by', 'updated_by'] }, (error, result) => {
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
 *       - Task
 *     description: Returns a single client
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Task's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single client
 */

// GET SINGLE CLIENT BY ID
router.get('/:id', auth, (req, resp, next) => {
    Task.findById(req.params.id).exec().then(client => {
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
 *       - Task
 *     description: Creates a new client
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: client
 *         description: Task object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 */
// SAVE CLIENT
router.post('/', auth, (req, resp, next) => {
    // First check if the conact with name and address already exists.
    Task.findOne({ firstname: req.body.name, address: req.body.address, is_active: true })
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
                const client = new Task({
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
                            message: "Task created successfully",
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
*       - Task
*     description: Updates a single client
*     produces: application/json
*     parameters:
*       name: client
*       in: body
*       description: Fields for the Task resource
*       schema:
*         type: array
*         $ref: '#/definitions/Task'
*     responses:
*       200:
*         description: Successfully updated
*/
// UPDATE CLIENT
router.put('/:id', auth, (req, resp, next) => {
    Task.findByIdAndUpdate(req.params.id, req.body).exec().then(client => {
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
 *       - Task
 *     description: Deletes a single client
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Task's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
// DELETE CLIENT (Hard delete. This will delete the entire client detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp, next) => {
    Task.findByIdAndRemove(req.params.id).exec().then(client => {
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
