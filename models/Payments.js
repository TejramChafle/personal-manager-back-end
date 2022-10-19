const mongoose = require('mongoose');

const PaymentsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: false
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

const Payments = module.exports = mongoose.model('Payments', PaymentsSchema);