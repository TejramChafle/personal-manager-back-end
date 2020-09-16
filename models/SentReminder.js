const mongoose = require('mongoose');

const SentReminderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reminder_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reminder',
        required: true
    },
    // contact to whome the message/reminder is was sent
    contact_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    // date & time of record creation
    created_date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const SentReminder = module.exports = mongoose.model('SentReminder', SentReminderSchema);