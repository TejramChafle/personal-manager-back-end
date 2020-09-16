const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    due_date: {
        type: Date,
        required: false
    },
    start_time: {
        type: Date,
        required: false
    },
    end_time: {
        type: Date,
        required: false
    },
    is_calendar_event: {
        type: Boolean,
        default: true
    },
    is_all_day: {
        type: Boolean,
        default: false
    },
    is_completed: {
        type: Boolean,
        default: false
    },
    is_priority: {
        type: Boolean,
        default: false
    },
    is_starred: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        trim: true
    },
    // list of ids assigned to the task
    tag_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    }],
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

const Todo = module.exports = mongoose.model('Todo', TodoSchema);