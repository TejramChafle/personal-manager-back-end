const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// The user schema only defines the application level user. This will help to manage authentication & authorization
const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    },
    // soft delete flag
    is_active: {
        type: Boolean,
        default: true
    },
    // list of devices used by user
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    }],
    photo: {
        type: String,
        required: false
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
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);