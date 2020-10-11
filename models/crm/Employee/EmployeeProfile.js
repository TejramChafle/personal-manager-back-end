const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const EmployeeProfileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    department: {
        type: String,
        required: false
    },
    designation: {
        type: String,
        required: false
    },
    date_of_joining: {
        type: Date,
        required: false
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: false
    },
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmployeeArea',
        required: false
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

EmployeeProfileSchema.plugin(Paginate);
const EmployeeProfile = module.exports = mongoose.model('EmployeeProfile', EmployeeProfileSchema);