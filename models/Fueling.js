const mongoose = require('mongoose');

const FuelingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // Petrol/Diesel [Frontend config]
    fuel: {
        type: String,
        required: true
    },
    // fuel resource id (petrol pump)
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FuelResource',
        required: true
    },
    // Filled/Brought (in vehicle/brought in can) [Frontend config]
    action: {
        type: String,
        required: true
    },
    // staff id who brought/went to petrol pump
    bought_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    // liter
    quantity: {
        type: Number,
        required: true
    },
    // date on which petrol bought
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    // total billing amount to pay/paid
    bill_amount: {
        type: Number,
        required: true
    },
    bill_number: {
        type: Number,
        required: true
    },
    // Paid/Unpaid [Frontend config]
    is_paid: {
        type: Boolean,
        required: true
    },
    // vehicle id (If the action is 'Brought', user must select the vehicle in which fuel was filled)
    filled_in: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: false
    },
    // comment/note
    desciption: {
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

const Fueling = module.exports = mongoose.model('Fueling', FuelingSchema);

