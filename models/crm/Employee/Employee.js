const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const EmployeeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: false
    },
    email: {
        type: String,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        trim: true,
        required: false
    },
    primary_phone: {
        type: String,
        required: true
    },
    alternate_phone: {
        type: String,
        required: false
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmployeeAddress',
        required: false
    },
    professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmployeeProfile',
        required: true
    },
    authorization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmployeeAuthorization',
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
        ref: 'Employee',
        required: true
    },
    // last updated by user id
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
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

EmployeeSchema.plugin(Paginate);
const Employee = module.exports = mongoose.model('Employee', EmployeeSchema);