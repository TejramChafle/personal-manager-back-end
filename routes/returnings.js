var express     = require('express');
var mongoose    = require('mongoose');
var Bill        = require('../models/Billing');
const auth      = require('../auth');

var router      = express.Router();

/**
 * @swagger
 * /bill:
 *   get:
 *     tags:
 *       - Bill
 *     description: Returns all bills
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of bills
 */
// GET BILLS (Only active) WITH filter & pagination
router.get('/', auth, (req, resp) => {
    Bill.where({ is_active: true }).exec().then(bills => {
        return resp.status(200).json(bills);
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
 * /bill/{id}:
 *   get:
 *     tags:
 *       - Bill
 *     description: Returns a single bill
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Bill's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single bill
 */

// GET SINGLE BILL BY ID
router.get('/:id', auth, (req, resp, next) => {
    Bill.findById(req.params.id).exec().then(bill => {
        return resp.status(200).json(bill);
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
 * /bill:
 *   post:
 *     tags:
 *       - Bill
 *     description: Creates a new bill
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: bill
 *         description: Bill object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Bill'
 *     responses:
 *       201:
 *         description: Bill created successfully
 */
// SAVE BILL
router.post('/', auth, (req, resp, next) => {
    // TODO: Need to implement functionality to check the works if billed in other bills
    Bill.findOne({ firstname: req.body.name, address: req.body.address, is_active: true })
        .exec()
        .then(bill => {
            // If the bill with name and address already exists, then return error
            if (bill) {
                // 409 : Conflict. The request could not be completed because of a conflict.
                return resp.status(409).json({
                    message: "The bill with name " + req.body.name + " and address " + req.body.address + " already exist."
                });
            } else {
                // Since the bill doesn't exist, then save the detail
                console.log(req.body);
                const bill = new Bill({
                    _id: new mongoose.Types.ObjectId(),
                    works:          req.body.works,
                    billing_to:     req.body.billing_to,
                    date:           req.body.date,
                    sub_total:      req.body.sub_total,
                    gst_percent:    req.body.gst_percent,
                    gst_amount:     req.body.gst_amount,
                    tds_percent:    req.body.tds_percent,
                    tds_amount:     req.body.tds_amount,
                    billed_amount:  req.body.billed_amount,
                    description:    req.body.description,
                    is_paid:        req.body.is_paid,
                    created_by:     req.body.created_by,
                    updated_by:     req.body.updated_by,
                    created_date:   Date.now(),
                    updated_date:   Date.now()
                });

                bill.save()
                    .then(result => {
                        console.log(result);
                        return resp.status(201).json({
                            message: "Bill created successfully",
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
* /bill/{id}:
*   put:
*     tags:
*       - Bill
*     description: Updates a single bill
*     produces: application/json
*     parameters:
*       name: bill
*       in: body
*       description: Fields for the Bill resource
*       schema:
*         type: array
*         $ref: '#/definitions/Bill'
*     responses:
*       200:
*         description: Successfully updated
*/
// UPDATE BILL
router.put('/:id', auth, (req, resp, next) => {
    Bill.findByIdAndUpdate(req.params.id, req.body).exec().then(bill => {
        return resp.status(200).json(bill);
    }).catch(error => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});


/**
 * @swagger
 * /bill/{id}:
 *   delete:
 *     tags:
 *       - Bill
 *     description: Deletes a single bill
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Bill's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
// DELETE BILL (Hard delete. This will delete the entire bill detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp, next) => {
    Bill.findByIdAndRemove(req.params.id).exec().then(bill => {
        return resp.status(200).json(bill);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});

module.exports = router;
