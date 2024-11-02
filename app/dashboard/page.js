"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  BanknoteIcon,
  ClipboardListIcon,
  ReceiptIcon,
  PlusCircleIcon,
  LogOutIcon,
  UserIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  SparklesIcon,
  ChartPie,
  ScanSearch,
} from "lucide-react";
import Header from "../components/Header";
import AdminDashboard from "../components/AdminDashboard";
import CloseDayModal from "../components/CloseDayModal";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const response = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data?.user) {
          const saleData = await axios.get("/api/reports/sales/list", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSales(saleData.data);

          const expenseData = await axios.get("/api/reports/expenses/list", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setExpenses(expenseData.data);

          setUser(response.data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const QuickActionButton = ({ label, icon: Icon, path }) => (
    <button
      onClick={() => router.push(path)}
      className="group relative flex flex-col items-center justify-center p-4 bg-white 
                 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
                 hover:-translate-y-1 overflow-hidden"
    >
      {/* Gradient Background on Hover */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Icon Container */}
      <div
        className="relative z-10 flex items-center justify-center w-12 h-12 mb-2
                    rounded-xl bg-blue-50 group-hover:bg-white/20 transition-all duration-300"
      >
        <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
      </div>

      {/* Label */}
      <span
        className="relative z-10 text-sm font-medium text-gray-700 
                     group-hover:text-white transition-colors duration-300"
      >
        {label}
      </span>
    </button>
  );

  const UserDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section with Premium Badge */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
                          bg-clip-text text-transparent"
            >
              Boba Metals
            </h1>
            <SparklesIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-sm text-gray-500">
            Let&apos;s manage your business
          </p>
        </div>
        <div className="relative group">
          <div
            className="absolute inset-0 bg-blue-200 rounded-full blur-md 
                       group-hover:blur-lg transition-all duration-300 opacity-50"
          />
          <div
            className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                       flex items-center justify-center shadow-lg"
          >
            <UserIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="relative group overflow-hidden bg-white p-5 rounded-2xl shadow-sm
                      hover:shadow-xl transition-all duration-300"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 
                       group-hover:opacity-100 transition-all duration-300"
          />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              ₹
              {sales
                .reduce((sum, sale) => sum + Number(sale.amount), 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        <div
          className="relative group overflow-hidden bg-white p-5 rounded-2xl shadow-sm
                      hover:shadow-xl transition-all duration-300"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-red-50 to-blue-50 opacity-0 
                       group-hover:opacity-100 transition-all duration-300"
          />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingDownIcon className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Expense</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              ₹
              {expenses
                .reduce((sum, expense) => sum + Number(expense.amount), 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickActionButton
            label="New Sale"
            icon={PlusCircleIcon}
            path="/sale"
          />
          <QuickActionButton
            label="View Sales"
            icon={BanknoteIcon}
            path="/sale-entries"
          />
          <QuickActionButton
            label="New Expense"
            icon={ReceiptIcon}
            path="/expenses"
          />
          <QuickActionButton
            label="View Expenses"
            icon={ClipboardListIcon}
            path="/expenses-entries"
          />
          <QuickActionButton
            label="Receipts"
            icon={ChartPie}
            path="/reciepts"
          />
          <QuickActionButton
            label="View Receipts"
            icon={ScanSearch}
            path="/reciepts-entries"
          />
          <CloseDayModal />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="max-w-lg mx-auto px-4 py-8 pb-24">
        {user.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
      </main>

      {/* Bottom Navigation */}
      <Header />
    </div>
  );
}
