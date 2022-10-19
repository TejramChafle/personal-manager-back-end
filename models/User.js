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
    isActive: {
        type: Boolean,
        default: true
    },
    // list of devices used by user
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: false
    }],
    photo: {
        type: String,
        required: false
    }
}, { timestamps: true });

// compare encrypted password with the password saved in db
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);