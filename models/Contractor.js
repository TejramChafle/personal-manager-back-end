const mongoose = require('mongoose');

const ContractorSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // name of contractor/department/devision/area/site
    name: {
        type: String,
        required: true
    },
    // contractor under the name of client
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    // engineer/manager/supervisor
    contact_person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    // office mobile
    mobile: {
        type: String,
        required: true
    },
    // office phone
    phone: {
        type: String,
        required: false
    },
    // office email
    email: {
        type: String,
        required: false
    },
    // office/site/area/field/devision/department address
    address: {
        type: String,
        required: false
    },
    // comment/note
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
        required: true
    },
    // last updated by user id
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
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

const Contractor = module.exports = mongoose.model('Contractor', ContractorSchema);

/* module.exports.getUserByUsername = function(username, cb) {
	Users.findOne({loginid: username}, cb);
} */