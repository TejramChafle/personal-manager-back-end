const express     = require('express');
const mongoose    = require('mongoose');
const Purchases   = require('../models/Purchases');
const Expenditures= require('../models/Expenditures');
const Payments= require('../models/Payments');
const auth      = require('../auth');

const router      = express.Router();

/**
 * @swagger
 * /purchases:
 *   get:
 *     tags:
 *       - Purchases
 *     description: Returns all purchases
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of purchases
 */
// GET PURCHASES (Only active) WITH filter & pagination
router.get('/', auth, (req, resp) => {
    console.log('req.query', req.query);
    let filter = {};
    filter.isActive = req.query.isActive || true;
    if (req.query.place) filter.place = new RegExp('.*' + req.query.place + '.*', 'i');
    if (req.query.date) filter.date = req.query.date;
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;
    /* Purchases.where({ is_active: true }).exec().then(purchases => {
        return resp.status(200).json(purchases);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    }); */

    Purchases.paginate(filter,{
        sort: { createdDate: req.query.sortOrder },
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit),
        populate: 'expenditure' 
    },(error, result) => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        console.log('result', result);
        if (error) {
            console.log('error', error);
            /* return resp.status(500).json({
                error: error
            }); */
        }
        return resp.status(200).json(result);
    });
});


/**
 * @swagger
 * /purchases/{id}:
 *   get:
 *     tags:
 *       - Purchases
 *     description: Returns a single purchase
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Purchases's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single purchase
 */

// GET SINGLE PURCHASE BY ID
router.get('/:id', auth, (req, resp, next) => {
    Purchases.findById(req.params.id).exec().then(purchase => {
        return resp.status(200).json(purchase);
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
 * /purchases:
 *   post:
 *     tags:
 *       - Purchases
 *     description: Creates a new purchase
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: purchase
 *         description: Purchases object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Purchases'
 *     responses:
 *       201:
 *         description: Purchases created successfully
 */
// SAVE PURCHASE
router.post('/', auth, (req, resp, next) => {
    // Need add to expenditure first expenditure
    console.log(req.body);
    const items = req.body.items;
    delete req.body.items;
    const medadata = {
        createdBy: req.body.createdBy,
        createdDate: new Date(),
        updatedDate: new Date()
    }
    const expenditure = new Expenditures({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    });
    console.log('expenditure input ', expenditure);
    expenditure.save()
        .then(result => {
            console.log('expenditure result', result);
            const purchase = new Purchases({
                _id: new mongoose.Types.ObjectId(),
                expenditure: result._id,
                items,
                ...medadata,
            });
            console.log('purchase input ', purchase);
            purchase.save()
                .then(result => {
                    console.log('purchase result', result);
                    return resp.status(201).json({
                        message: req.body.purpose + " information saved successfully",
                        result: result
                    });
                })
                .catch(error => {
                    console.log('purchase error : ', error);
                    // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
                    return resp.status(500).json({
                        error: error
                    });
                });
        })
        .catch(error => {
            console.log('expenditure error : ', error);
            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
            return resp.status(500).json({
                error: error
            });
        });
});

/**
* @swagger
* /purchases/{id}:
*   put:
*     tags:
*       - Purchases
*     description: Updates a single purchase
*     produces: application/json
*     parameters:
*       name: purchase
*       in: body
*       description: Fields for the Purchases resource
*       schema:
*         type: array
*         $ref: '#/definitions/Purchases'
*     responses:
*       200:
*         description: Successfully updated
*/
// UPDATE PURCHASE
router.put('/:id', auth, (req, resp, next) => {
    console.log('req.body', req.body);
    let updatedPayment;
    // If payment information already exists, then update payment infomation
    if (req.body.payment && req.body.payment._id) {
        /* Payments.findByIdAndUpdate(req.body.payment._id, req.body.payment).exec().then(result => {
            updatedPayment = result;
            console.log('updatedPayment', updatedPayment);
        }).catch(error => {
            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
            return resp.status(500).json({
                error: error
            });
        }); */
    } else {
        const payment = new Payments({
            _id: new mongoose.Types.ObjectId(),
            ...req.body.payment,
            createdDate: new Date(),
            createdBy: req.body.createdBy
        });
        delete req.body.payment;
        console.log('payment input ', payment);
        payment.save().then(result => {
            console.log('payment update result', result);
            console.log('update params', { ...req.body.expenditure, payment: result._id });
            /* Expenditures.findOneAndUpdate(
                { _id: req.body.id },
                { 
                    updatedDate: new Date(),
                    createdBy: req.body.createdBy,
                    payment: result._id
                },
                { new: true })
                .then(expenditure => {
                    console.log('expenditure updated', expenditure);
                    return resp.status(200).json(expenditure);
                }).catch(error => {
                    // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
                    return resp.status(500).json({
                        error: error
                    });
                }) */
                Expenditures.updateOne(
                    { _id: req.body.expenditure._id },
                    { 
                        updatedDate: new Date(),
                        createdBy: req.body.createdBy,
                        payment: result._id
                    })
                    .then(expenditure => {
                        console.log('expenditure updated', expenditure);
                        return resp.status(200).json(expenditure);
                    }).catch(error => {
                        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
                        return resp.status(500).json({
                            error: error
                        });
                    })
        }).catch(error => {
            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
            return resp.status(500).json({
                error: error
            });
        });
    }

    /* console.log('updatedPayment', updatedPayment);
    const paymentId = updatedPayment ? updatedPayment._id : req.body.payment._id;
    console.log('paymentId', paymentId);
    Purchases.findByIdAndUpdate(req.body.id, { ...req.body, payment: updatedPayment._id }).exec().then(purchase => {
        console.log('purchase updated', purchase);
        return resp.status(200).json(purchase);
    }).catch(error => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    }) */
    /* Purchases.findByIdAndUpdate(req.params.id, req.body).exec().then(purchase => {
        return resp.status(200).json(purchase);
    }).catch(error => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });*/
});


/**
 * @swagger
 * /purchases/{id}:
 *   delete:
 *     tags:
 *       - Purchases
 *     description: Deletes a single purchase
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Purchases's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
// DELETE PURCHASE (Hard delete. This will delete the entire purchase detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp, next) => {
    Purchases.findByIdAndRemove(req.params.id).exec().then(purchase => {
        return resp.status(200).json(purchase);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});

module.exports = router;
