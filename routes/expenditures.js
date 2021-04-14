const express     = require('express');
const mongoose    = require('mongoose');
const Expenditures = require('../models/Expenditures');
const Payments = require('../models/Payments');
const auth      = require('../auth');
const router      = express.Router();

/**
 * @swagger
 * /purchases:
 *   get:
 *     tags:
 *       - Expenditures
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

    Expenditures.paginate(filter,{
        sort: { createdDate: req.query.sortOrder },
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit),
        populate: 'payment' 
    },(error, result) => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        console.log('result', result);
        if (error) {
            console.log('error', error);
            return resp.status(500).json({
                error: error
            });
        }
        return resp.status(200).json(result);
    });
});

/**
 * @swagger
 * /attendance:
 *   post:
 *     tags:
 *       - Expenditure
 *     description: Creates a new attendance
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: attendance
 *         description: Expenditure object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Expenditure'
 *     responses:
 *       201:
 *         description: Expenditure created successfully
 */
// SAVE EXPENDITURE
router.post('/', auth, (req, resp, next) => {
    console.log(req.body);
    const payinfo = req.body.payment;
    const medadata = {
        createdBy: req.body.createdBy,
        createdDate: new Date(),
        updatedDate: new Date()
    }
    const payment = new Payments({
        _id: new mongoose.Types.ObjectId(),
        ...payinfo,
        ...medadata
    });
    console.log('payment input ', payment);
    payment.save().then(result => {
        console.log('expenditure result', result);
        const expenditures = new Expenditures({
            _id: new mongoose.Types.ObjectId(),
            payment: result._id,
            ...req.body
        });
        console.log('expenditures input ', expenditures);
        expenditures.save().then(result => {
            console.log('expenditures result', result);
            return resp.status(201).json({
                message: "Expenditure information saved successfully",
                result: result
            });
        }).catch(error => {
            console.log('expenditures error : ', error);
            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
            return resp.status(500).json({
                error: error
            });
        });
    }).catch(error => {
        console.log('expenditure error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});


/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     tags:
 *       - Expenditure
 *     description: Deletes a single attendance
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Expenditure's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
// DELETE EXPENDITURE (Hard delete. This will delete the entire attendance detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp, next) => {
    Expenditure.findByIdAndRemove(req.params.id).exec().then(attendance => {
        return resp.status(200).json(attendance);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});

module.exports = router;
