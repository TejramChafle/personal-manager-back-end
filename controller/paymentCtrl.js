const handler = require('../helper/handler');
const Expenditures = require('../models/Expenditures');
const Payments = require('../models/Payments');
const mongoose = require('mongoose');

// Save/Insert
paymentPost = async (medadata, req, resp, next) => {
    const payment = new Payments({
        _id: new mongoose.Types.ObjectId(),
        ...req.body.payment,
        ...medadata
    });
    let expenditures;
    await payment.save().then(result => {
        console.log('payment result', result);
        expenditures = new Expenditures({
            _id: new mongoose.Types.ObjectId(),
            ...req.body,
            payment: result._id
        });
    }).catch(error => {
        errorHandler(error, req, resp, next);
    });
    expenditures.save().then(result => {
        return resp.status(201).json({
            message: "Expenditure information saved successfully",
            result: result
        });
    }).catch(error => {
        errorHandler(error, req, resp, next);
    });
}

paymentPut = async (medadata, req, resp, next) => {
    console.log('#PAYMENT_PUT req.body', req.body, medadata);
    let paymentInfo;
    // If payment information already exists, then skip payment update
    if (req.body.payment && req.body.payment._id) {
        // paymentInfo = req.body.payment;
        // delete req.body.payment;
        await Payments.updateOne(
            { _id: req.body.payment._id },
            {   ...req.body.payment,
                ...medadata
            }).then(result => {
                paymentInfo = result;
                console.log('#PAYMENT_RES result', result);
                // return resp.status(200).json(expenditure);
            }).catch(error => { errorHandler(error, req, resp, next); })
    } else if (req.body.payment && !req.body.payment._id) {
        // SAVE PAYMENT if not available
        const payment = new Payments({
            _id: new mongoose.Types.ObjectId(),
            ...req.body.payment,
            ...medadata
        });
        await payment.save().then(result => {
            paymentInfo = result;
        }).catch(error => { errorHandler(error, req, resp, next); });
    }

    let expenditureUpdateParams = {
        ...req.body,
        medadata,
        _id: req.body.id
    }
    if (paymentInfo) {
        expenditureUpdateParams.payment = req.body.payment._id;
    }

    console.log('#EXP_PAYLOAD:', expenditureUpdateParams);

    // UPDATE Expenditure
    await Expenditures.updateOne(
        { _id: req.body.id },
        {
            ...expenditureUpdateParams
        }).then(expenditure => {
            console.log('#EXPENDITURE_UPDATED', expenditure);
            return resp.status(200).json(expenditure);
        }).catch(error => { errorHandler(error, req, resp, next); })
    
    // UPDATE purchase if items added
    /* if (req.body.items) {
        await Purchases.updateOne(
            { _id: req.body.id },
            {
                items: req.body.items,
                expenditure: req.body.expenditure._id,
                updatedBy: req.body.updatedBy,
                updatedDate: req.body.updatedDate
            }).then(purchase => {
                return resp.status(200).json(purchase);
            }).catch(error => { errorHandler(error, req, resp, next); })
    } */
}

module.exports = paymentPost;