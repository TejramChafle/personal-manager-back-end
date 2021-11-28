const handler = require('../helper/handler');
const Purchases = require('../models/Purchases');
const Expenditures = require('../models/Expenditures');
const mongoose = require('mongoose');

const purchasesPost = async (medadata, req, resp, next) => {
    // Need add to expenditure first expenditure
    console.log(req.body);
    const items = req.body.items;
    delete req.body.items;
    const expenditure = new Expenditures({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    });
    let savedExpenditure;
    await expenditure.save().then(result => {
        savedExpenditure = result; 
    }).catch(error => {
        errorHandler(error, req, resp, next);
    });
    
    const purchase = new Purchases({
        _id: new mongoose.Types.ObjectId(),
        expenditure: savedExpenditure._id,
        items,
        ...medadata,
    });
    purchase.save().then(result => {
        return resp.status(201).json({
            message: req.body.purpose + " information saved successfully",
            result: result
        });
    }).catch(error => {
        errorHandler(error, req, resp, next);
    });
}
module.exports = purchasesPost;