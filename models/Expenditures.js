const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const ExpendituresSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: {
        type: Date,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    // payment detail id
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payments',
        required: false
    },
    // soft delete flag
    isActive: {
        type: Boolean,
        default: true
    },
    // created by user id
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // date & time of record creation
    createdDate: {
        type: Date,
        required: true
    },
    // last date & time of record updation
    updatedDate: {
        type: Date,
        default: Date.now,
        required: true
    }
});

ExpendituresSchema.plugin(Paginate);
const Expenditures = module.exports = mongoose.model('Expenditures', ExpendituresSchema);