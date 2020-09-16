const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    ownership: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    // soft delete flag
    is_active: {
        type: Boolean,
        default: true
    },
    // created by user id
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // last updated by user id
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // date & time of record creation
    created_date: {
        type: Date,
        required: true
    },
    // last date & time of record updation
    updated_date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Vehicle = module.exports = mongoose.model('Vehicle', VehicleSchema);