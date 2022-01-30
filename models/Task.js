const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const TaskSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    schedule: {
        type: Object,
        required: false
    },
    labels: [{
        type: Object,
        required: false
    }],
    isStarred: {
        type: Boolean,
        required: false
    },
    isImportant: {
        type: Boolean,
        required: false
    },
    isDone: {
        type: Boolean,
        required: false
    },
    // created by user id
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // last updated by user id
    updatedBy: {
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
}, { timestamps: true });

TaskSchema.plugin(Paginate);
const Task = module.exports = mongoose.model('Task', TaskSchema);

/* module.exports.getUserByUsername = function(username, cb) {
    Users.findOne({loginid: username}, cb);
} */