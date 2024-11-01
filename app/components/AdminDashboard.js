"use client";

import { useEffect, useState } from "react";
import {
  TrendingDown,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
} from "lucide-react";

export default function AdminDashboard() {
  const [reportData, setReportData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
    profitMargin: 0,
  });

  const [previousStats, setPreviousStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  useEffect(() => {
    async function fetchReports(date) {
      try {
        const [salesResponse, expensesResponse] = await Promise.all([
          fetch(`/api/reports/sales?date=${date}`), // Pass the selected date
          fetch(`/api/reports/expenses?date=${date}`), // Pass the selected date
        ]);

        const salesData = await salesResponse.json();
        const expensesData = await expensesResponse.json();

        const combinedData = salesData.map((sale) => {
          const expense =
            expensesData.find((exp) => exp.date === sale.date) || {};
          return {
            date: sale.date,
            totalSales: sale.totalSales || 0,
            totalExpenses: expense.totalExpenses || 0,
          };
        });

        setReportData(combinedData);

        const totalSales = combinedData.reduce(
          (sum, item) => sum + item.totalSales,
          0
        );
        const totalExpenses = combinedData.reduce(
          (sum, item) => sum + item.totalExpenses,
          0
        );
        const profitMargin =
          ((totalSales - totalExpenses) / totalSales) * 100 || 0;

        setSummaryStats({
          totalSales,
          totalExpenses,
          profitMargin,
        });

        const salesChange = previousStats.totalSales
          ? ((totalSales - previousStats.totalSales) /
              previousStats.totalSales) *
            100
          : 0;
        const expensesChange = previousStats.totalExpenses
          ? ((totalExpenses - previousStats.totalExpenses) /
              previousStats.totalExpenses) *
            100
          : 0;

        const salesTrendValue = salesChange ? salesChange.toFixed(1) : "0.0";
        const expensesTrendValue = expensesChange
          ? expensesChange.toFixed(1)
          : "0.0";

        const profitMarginChange = previousStats.profitMargin
          ? ((profitMargin - previousStats.profitMargin) /
              previousStats.profitMargin) *
            100
          : 0;

        const profitMarginTrendValue = profitMarginChange
          ? `${profitMarginChange >= 0 ? "+" : ""}${profitMarginChange.toFixed(
              1
            )}%`
          : "0.0%";

        setPreviousStats({
          totalSales,
          totalExpenses,
          profitMargin,
        });

        setSummaryStats((prevStats) => ({
          ...prevStats,
          salesTrendValue: `${salesChange >= 0 ? "+" : ""}${salesTrendValue}%`,
          expensesTrendValue: `${
            expensesChange >= 0 ? "+" : ""
          }${expensesTrendValue}%`,
          profitMarginTrendValue, // Set the dynamic profit margin trend value
        }));
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }

    fetchReports(selectedDate); // Fetch reports based on the selected date
  }, [
    selectedDate,
    previousStats.totalSales,
    previousStats.totalExpenses,
    previousStats.profitMargin,
  ]); // Dependency on selectedDate

  // Custom Button Component
  const Button = ({
    children,
    variant = "default",
    className = "",
    ...props
  }) => {
    const baseStyle =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    };

    return (
      <button
        className={`${baseStyle} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  // Custom Card Component
  const SummaryCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    subtitle,
  }) => {
    const isPositive = trend === "up";
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <Icon className="h-4 w-4 text-gray-500" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{value}</div>
            <div className="flex items-center space-x-2 mt-1">
              {trendValue && (
                <span
                  className={`flex items-center text-xs ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {trendValue}
                </span>
              )}
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Financial Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Track your business performance and insights
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden md:flex h-9 px-3"
              onClick={() => {
                const today = new Date();
                setSelectedDate(today.toISOString().split("T")[0]);
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Select Date
            </Button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)} // Update selected date
              className="h-9 border border-gray-300 rounded-md p-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Sales"
            value={`₹${summaryStats.totalSales.toLocaleString()}`}
            icon={IndianRupee}
            trend="up"
            trendValue={summaryStats.salesTrendValue}
            subtitle=""
          />

          <SummaryCard
            title="Total Expenses"
            value={`₹${summaryStats.totalExpenses.toLocaleString()}`}
            icon={TrendingDown}
            trend="down"
            trendValue={summaryStats.expensesTrendValue}
            subtitle=""
          />
          <SummaryCard
            title="Daily Profit Margin"
            value={`${summaryStats.profitMargin.toFixed(1)}%`}
            icon={IndianRupee}
            trend={summaryStats.profitMarginTrendValue >= 0 ? "up" : "down"}
            trendValue={summaryStats.profitMarginTrendValue}
            subtitle="Net profit percentage"
          />
        </div>
      </div>
    </div>
  );
}
