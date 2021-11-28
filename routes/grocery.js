var express     = require('express');
var mongoose    = require('mongoose');
var Fueling     = require('../models/Fueling');
const auth      = require('../auth');

var router      = express.Router();

/**
 * @swagger
 * /fueling:
 *   get:
 *     tags:
 *       - Fueling
 *     description: Returns all fuelings
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of fuelings
 */
// GET FUELINGS (Only active) WITH filter & pagination
router.get('/', auth, (req, resp) => {
    Fueling.where({ is_active: true }).exec().then(fuelings => {
        return resp.status(200).json(fuelings);
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
 * /fueling/{id}:
 *   get:
 *     tags:
 *       - Fueling
 *     description: Returns a single fueling
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Fueling's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single fueling
 */

// GET SINGLE FUELING BY ID
router.get('/:id', auth, (req, resp, next) => {
    Fueling.findById(req.params.id).exec().then(fueling => {
        return resp.status(200).json(fueling);
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
 * /fueling:
 *   post:
 *     tags:
 *       - Fueling
 *     description: Creates a new fueling
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: fueling
 *         description: Fueling object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Fueling'
 *     responses:
 *       201:
 *         description: Fueling created successfully
 */
// SAVE FUELING
router.post('/', auth, (req, resp, next) => {
    // First check if the fueling with bill number already exists
    Fueling.findOne({ bill_number: req.body.bill_number, is_active: true })
        .exec()
        .then(fueling => {
            // If the fueling with bill number already exists, then return error
            if (fueling) {
                // 409 : Conflict. The request could not be completed because of a conflict.
                return resp.status(409).json({
                    message: "The fueling for bill number " + req.body.bill_number + " is already entered for date " + req.body.date
                });
            } else {
                // Since the fueling doesn't exist, then save the detail
                console.log(req.body);
                const fueling = new Fueling({
                    _id: new mongoose.Types.ObjectId(),
                    fuel: req.body.fuel,
                    source: req.body.source,
                    action: req.body.action,
                    bought_by: req.body.bought_by,
                    quantity: req.body.quantity,
                    date: req.body.date,
                    time: req.body.time,
                    bill_amount: req.body.bill_amount,
                    bill_number: req.body.bill_number,
                    is_paid: req.body.is_paid,
                    filled_in: req.body.filled_in,
                    desciption: req.body.desciption,
                    created_by: req.body.created_by,
                    updated_by: req.body.updated_by,
                    created_date: Date.now(),
                    updated_date: Date.now()
                });

                fueling.save()
                    .then(result => {
                        console.log(result);
                        return resp.status(201).json({
                            message: "Fuel bill submitted successfully",
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
* /fueling/{id}:
*   put:
*     tags:
*       - Fueling
*     description: Updates a single fueling
*     produces: application/json
*     parameters:
*       name: fueling
*       in: body
*       description: Fields for the Fueling resource
*       schema:
*         type: array
*         $ref: '#/definitions/Fueling'
*     responses:
*       200:
*         description: Successfully updated
*/
// UPDATE FUELING
router.put('/:id', auth, (req, resp, next) => {
    Fueling.findByIdAndUpdate(req.params.id, req.body).exec().then(fueling => {
        return resp.status(200).json(fueling);
    }).catch(error => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});


/**
 * @swagger
 * /fueling/{id}:
 *   delete:
 *     tags:
 *       - Fueling
 *     description: Deletes a single fueling
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Fueling's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
// DELETE FUELING (Hard delete. This will delete the entire fueling detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp, next) => {
    Fueling.findByIdAndRemove(req.params.id).exec().then(fueling => {
        return resp.status(200).json(fueling);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});

module.exports = router;
