const mongoose = require('mongoose');

const StaffSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
    contact_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
		required: true
    },
    // Temporary/Permanent
	job_status: {
		type: String,
		required: true
    },
    date_of_joining: {
		type: Date,
		required: true
    },
    // Per day wage
    wage_per_day: {
		type: Number,
		required: true
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

const Staff = module.exports = mongoose.model('Staff', StaffSchema);

