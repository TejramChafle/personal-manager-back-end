const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // name of Event
    name: {
        type: String,
        required: true
    },
    // comment/note
    description: {
        type: String,
        required: false
    },
    // start time
    startTime: {
        type: Date,
        required: false
    },
    // end time
    endTime: {
        type: Date,
        required: false
    },
    // month loop will help to identify if the event will happen on every month on same date & time
    monthLoop: {
        type: Boolean,
        default: true
    },
    // Flag to indicate the all day event
    allDay: {
        type: Boolean,
        default: true
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

const Event = module.exports = mongoose.model('Event', EventSchema);