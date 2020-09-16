const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const DeviceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    model: {
        type: String,
        required: false
    },
    platform: {
        type: String,
        required: false
    },
    uuid: {
        type: String,
        required: false
    },
    version: {
        type: String,
        required: false
    },
    manufacturer: {
        type: String,
        required: false
    },
    serial: {
        type: String,
        required: false
    },
    firebase_token: {
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

DeviceSchema.plugin(Paginate);
const Device = module.exports = mongoose.model('Device', DeviceSchema);