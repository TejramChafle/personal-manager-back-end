var mongoose = require('mongoose');

var MaintenanceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // Maintenace type (Servicing, Failure Repair, Part Replacement, Puncture, Other)
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    start_time: {
        type: Date,
        required: false
    },
    end_time: {
        type: Date,
        required: false
    },
    persons_involved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    }],
    equipment_removed: {
        type: String,
        required: false
    },
    equipment_installed: {
        type: String,
        required: false
    },
    bill_amount: {
        type: String,
        required: false
    },
    bill_number: {
        type: Number,
        required: false
    },
    is_paid: {
        type: Boolean,
        required: false
    },
    // Work done in detail
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

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
