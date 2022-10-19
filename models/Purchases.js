const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const PurchasesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    expenditure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expenditures',
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    // soft delete flag
    isActive: {
        type: Boolean,
        default: true
    },
    // created by user id
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

PurchasesSchema.plugin(Paginate);
const Purchases = module.exports = mongoose.model('Purchases', PurchasesSchema);