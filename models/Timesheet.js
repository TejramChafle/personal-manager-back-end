var mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

var TimesheetSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    }],
    // created by user id
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

TimesheetSchema.plugin(Paginate);
module.exports = mongoose.model('Timesheet', TimesheetSchema);
