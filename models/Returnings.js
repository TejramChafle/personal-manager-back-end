const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const ReturningSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // billing date
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    expectedReturnDate: {
        type: Date,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    person: {
        type: String,
        required: false
    },
    purpose: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    // created by user id
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

ReturningSchema.plugin(Paginate);
const Returning = module.exports = mongoose.model('Returning', ReturningSchema);