const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({  
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
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
   
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);