// pages/expense.js
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import ExpensesForm from "../components/ExpensesForm";
import { saveExpense } from "../services/indexedDB";
import { syncExpenses } from "../services/expenseSync";

export default function ExpenseEntries() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
      if (navigator.onLine) {
        syncExpenses();
      }
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  const handleAddExpense = async (expenseData) => {
    setLoading(true);
    try {
      if (!navigator.onLine) {
        // Save to IndexedDB when offline
        await saveExpense(expenseData);
        alert("Expense saved offline. Will sync when online.");
        router.push("/expenses-entries");
      } else {
        // Send to server when online
        const token = localStorage.getItem("token");
        await axios.post("/api/reports/expenses", expenseData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        router.push("/expenses-entries");
      }
      setError(null);
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-6 mb-10">
        {isOffline && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-xl">
            You are offline. Your expenses will be synced when you are back
          </div>
        )}
        <ExpensesForm onSubmit={handleAddExpense} loading={loading} />
        {error && (
          <p className="text-red-500 mt-4 p-3 bg-red-50 rounded-xl">{error}</p>
        )}
      </div>
    </>
  );
}
