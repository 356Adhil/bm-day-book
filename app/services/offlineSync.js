// bm-day-book/app/services/offlineSync.js
import axios from "axios";
import { getPendingSales, deletePendingSale } from "./indexedDB";

export const syncSales = async () => {
  const pendingSales = await getPendingSales();
  const token = localStorage.getItem("token");

  for (const sale of pendingSales) {
    try {
      if (sale.updatedOffline) {
        // Sync updated sales
        await axios.put(
          "/api/reports/sales/list",
          {
            id: sale._id,
            amount: sale.amount,
            invoiceNumber: sale.invoiceNumber,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Sync new sales
        await axios.post("/api/reports/sales", sale, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await deletePendingSale(sale.id);
    } catch (error) {
      console.error("Failed to sync sale:", sale, error);
    }
  }
};

export const syncExpenses = async () => {
  const token = localStorage.getItem("token");
  const pendingExpenses = await getPendingExpenses();

  for (const expense of pendingExpenses) {
    try {
      console.log("Syncing expense:", expense);
      if (expense.originalId) {
        // If it's an update
        await axios.put(
          `/api/reports/expenses/list`,
          {
            id: expense.originalId,
            amount: expense.amount,
            description: expense.description,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // If it's a new expense
        await axios.post(
          "/api/reports/expenses",
          {
            amount: expense.amount,
            description: expense.description,
            date: expense.date,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      await deletePendingExpense(expense.id);
      console.log("Expense synced:", expense);
    } catch (error) {
      console.error("Failed to sync expense:", expense, error);
    }
  }
};
