// bm-day-book/app/services/models/Expense.js
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the employee who entered the expense
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Only allows current date entries for employees
  },
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
