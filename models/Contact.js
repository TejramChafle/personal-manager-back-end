const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const ContactSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        trim: true,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    designation: {
        type: String,
        required: false
    },
    birthday: {
        type: Date,
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
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
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

ContactSchema.plugin(Paginate);
const Contact = module.exports = mongoose.model('Contact', ContactSchema);

// Get the contact full name
ContactSchema.virtual('fullname').get(function() {
    console.log('fullname : ',this.firstname + ' ' + this.lastname);
    return this.firstname + ' ' + this.lastname;
});

/* module.exports.getUserByUsername = function(username, cb) {
	Users.findOne({loginid: username}, cb);
} */