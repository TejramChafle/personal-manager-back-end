const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // Bill Payment Reminder/Salary Payment Statement/Festival Greeting/Birthday Wishes [Frontend config]
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    scheduled_date: {
        type: Date,
        required: true
    },
    // list of contact to whome the message/reminder is to be sent
    contact_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    }],
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

const Reminder = module.exports = mongoose.model('Reminder', ReminderSchema);