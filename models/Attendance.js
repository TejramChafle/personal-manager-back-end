const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // Day/Night [Frontend config]
    shift: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    // staff ids present on date
    staff_present: [{
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

const Attendance = module.exports = mongoose.model('Attendance', AttendanceSchema);