const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');
const bcrypt = require('bcrypt');

const EmployeeAuthorizationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    role: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
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

// compare encrypted password with the password saved in db
EmployeeAuthorizationSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

EmployeeAuthorizationSchema.plugin(Paginate);
const EmployeeAuthorization = module.exports = mongoose.model('EmployeeAuthorization', EmployeeAuthorizationSchema);