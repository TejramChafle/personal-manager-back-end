const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
    name: {
		type: String,
		required: true
	},
	rate: {
        type: Number,
		required: true
    },
    // Per hour/day/trip/person [Configuration]
    unit: {
        type: String,
		required: true
    },
    // comment/note
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

const Service = module.exports = mongoose.model('Service', ServiceSchema);

// module.exports.getByAccId = function(accid, cb) {
// 	Users.findOne({loginid: username}, cb);
// }