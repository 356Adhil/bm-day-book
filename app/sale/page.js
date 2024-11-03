"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SalesForm from "../components/SalesForm";
import Header from "../components/Header";
import axios from "axios"; // Make sure axios is installed
import db from "../services/indexedDb";

export default function Sales() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State to manage loading

  // useEffect(() => {
  //   syncSalesData(); // Try syncing data on component load
  // }, []);
  const generateObjectId = () => {
    return [...Array(24)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  };

  const handleFormSubmit = async (formData) => {
    console.log("Sales data submitted:", formData);

    const dataToStore = {
      _id: generateObjectId(),
      amount: Number(formData.saleAmount),
      date: new Date().toISOString(),
      invoiceNumber: String(formData.invoiceNumber),
      synced: false,
    };

    try {
      setLoading(true);
      await db.sales.add(dataToStore);
      console.log("Data saved to IndexedDB:", dataToStore);

      // Check all entries in the sales table
      const allSales = await db.sales.toArray();
      console.log("All sales entries:", allSales);

      if (navigator.onLine) syncDataToServer();

      // router.push("/sale-entries"); // Redirect to home page
    } catch (error) {
      console.error("Error saving sales data:", error);
      alert("Failed to save sales data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const syncDataToServer = async () => {
    try {
      const token = localStorage.getItem("token");

      // Get local sales and expenses data
      const localSales = await db.sales.toArray();

      // Send local data to MongoDB
      await axios.post(
        "/api/sync/sales",
        { sales: localSales },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Data synced successfully");
    } catch (error) {
      console.error("Sync failed", error);
      alert("Data sync failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="p-6">
        <SalesForm onSubmit={handleFormSubmit} loading={loading} />
      </div>
    </>
  );
}
