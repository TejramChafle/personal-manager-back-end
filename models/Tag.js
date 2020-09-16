const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate');

const TagSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // name of modules including contact/todos/work/reminder
    purpose: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
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

TagSchema.plugin(Paginate);
const Tag = module.exports = mongoose.model('Tag', TagSchema);