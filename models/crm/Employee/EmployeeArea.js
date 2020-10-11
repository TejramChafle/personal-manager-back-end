const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const EmployeeAreaSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    house: {
        type: String,
        required: false
    },
    landmark: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: false
    },
    postal_code: {
        type: String,
        default: false
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

EmployeeAreaSchema.plugin(Paginate);
const EmployeeArea = module.exports = mongoose.model('EmployeeArea', EmployeeAreaSchema);