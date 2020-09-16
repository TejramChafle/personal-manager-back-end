const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    vehicle_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    rent_amount: {
        type: Number,
        required: true
    },
    since_rented_date: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: false
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

const Rental = module.exports = mongoose.model('Rental', RentalSchema);