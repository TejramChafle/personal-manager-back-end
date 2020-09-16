const mongoose = require('mongoose');

const AuthenticationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ip_address: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    os_version: {
        type: String,
        required: false
    },
    manufacturer: {
        type: String,
        required: false
    },
    is_success: {
        type: String,
        required: false
    },
    auth_token: {
        type: String,
        required: false
    },
    // date & time of record creation
    created_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    // If left blank/empty, no expiry time will be considered
    expiry_time: {
        type: Date,
        required: false
    }
});

const Authentication = module.exports = mongoose.model('Authentication', AuthenticationSchema);