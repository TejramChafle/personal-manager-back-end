const mongoose = require('mongoose');

const BillingSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // collection of works for which bill will be created
    works: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkDone',
        required: true
    }],
    // contractor/client id
    billing_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    // billing date
    date: {
        type: Date,
        required: true
    },
    sub_total: {
        type: Number,
        required: true
    },
    gst_percent: {
        type: Number,
        required: true
    },
    gst_amount: {
        type: Number,
        required: true
    },
    tds_percent: {
        type: Number,
        required: false
    },
    tds_amount: {
        type: Number,
        required: false
    },
    billed_amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    is_paid: {
        type: Boolean,
        default: true
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

const Billing = module.exports = mongoose.model('Billing', BillingSchema);