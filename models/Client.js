const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const ClientSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    contact_person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
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
        ref: 'Contact',
        required: true
    },
    // last updated by user id
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
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

ClientSchema.plugin(Paginate);
const Client = module.exports = mongoose.model('Client', ClientSchema);

/* module.exports.getUserByUsername = function(username, cb) {
	Users.findOne({loginid: username}, cb);
} */