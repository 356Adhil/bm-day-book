"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SalesForm from "../components/SalesForm";
import Header from "../components/Header";
import axios from "axios"; // Make sure axios is installed
import { saveSale } from "../services/indexedDB";
import { syncSales } from "../services/offlineSync";

export default function Sales() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State to manage loading

  useEffect(() => {
    if (navigator.onLine) {
      syncSales();
    }
  }, []);

  // Inside handleFormSubmit function in Sales component
  const handleFormSubmit = async (formData) => {
    console.log("Sales data submitted:", formData);

    // Prepare data
    const dataToSend = {
      amount: formData.saleAmount,
      date: new Date().toISOString(),
      invoiceNumber: formData.invoiceNumber,
    };

    try {
      setLoading(true);

      // Check if offline
      if (!navigator.onLine) {
        // Store data in IndexedDB for later synchronization
        await saveSale(dataToSend);
        // alert("No internet connection. Sale data saved");
        router.push("/sale-entries");
      } else {
        // Send data to the backend API if online
        await axios.post("/api/reports/sales", dataToSend);
        router.push("/sale-entries");
      }
    } catch (error) {
      console.error("Error submitting sales data:", error);
      alert("Failed to submit sales data. Please try again.");
    } finally {
      setLoading(false);
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
