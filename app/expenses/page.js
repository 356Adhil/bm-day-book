// bm-day-book/app/pages/expense-entries.js
"use client";

import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import ExpensesForm from "../components/ExpensesForm";

export default function ExpenseEntries() {
  const [error, setError] = useState(null);

  const handleAddExpense = async (expenseData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/reports/expenses", expenseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Optionally, show a success message or clear the error
      setError(null);
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Add Expense</h1>
        <ExpensesForm onSubmit={handleAddExpense} />

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
}
