const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    icon:{
        type: String,
        default: null,
    },
    amount: {
        type: Number,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    description: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);