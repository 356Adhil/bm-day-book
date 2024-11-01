"use client"
// bm-day-book/app/components/ExpensesForm.js
import { useState } from 'react';

export default function ExpensesForm({ onSubmit }) {
  const [expenseAmount, setExpenseAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ expenseAmount, description });
    setExpenseAmount('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 p-4">
      <input
        type="number"
        placeholder="Expense Amount"
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn-primary">Submit Expense</button>
    </form>
  );
}
