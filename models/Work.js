const mongoose = require('mongoose');

const WorkSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
		required: true
	},
	date: {
		type: Date,
		required: true
    },
    start_time: {
		type: Date,
		required: true
    },
    end_time: {
		type: Date,
		required: true
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
		required: true
    },
    site: {
        type: String,
		required: true
    },
    workers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    	required: true
    }],
    rate: {
    	type: Number,
    	required: true
    },
    quantity: {
    	type: Number,
    	required: true
    },
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

const Work = module.exports = mongoose.model('Work', WorkSchema);

/* WorkSchema.virtual('PMDetails', {
  ref: 'Metrics', // The model to use
  localField: 'metid', // Find people where `localField`
  foreignField: 'metid', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false
  //,
  //options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
}); */

