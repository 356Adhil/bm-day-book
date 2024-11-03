// services/expenseSync.js
import axios from "axios";
import { getPendingExpenses, deletePendingExpense } from "./indexedDB";

export const syncExpenses = async () => {
  const pendingExpenses = await getPendingExpenses();
  const token = localStorage.getItem("token");

  for (const expense of pendingExpenses) {
    try {
      console.log("Syncing expense:", expense);
      await axios.post(
        "/api/reports/expenses",
        {
          expenseAmount: expense.expenseAmount,
          description: expense.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await deletePendingExpense(expense.id);
      console.log("Expense synced successfully:", expense);
    } catch (error) {
      console.error("Failed to sync expense:", expense, error);
    }
  }
};

// Add this to your existing OnlineSync component
export const enhanceOnlineSync = async () => {
  const handleOnline = () => {
    syncExpenses();
  };
  window.addEventListener("online", handleOnline);
  return () => window.removeEventListener("online", handleOnline);
};
