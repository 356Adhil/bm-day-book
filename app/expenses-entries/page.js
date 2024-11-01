"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

export default function SaleEntries() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSale, setEditingSale] = useState(null);
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedInvoiceNumber, setUpdatedInvoiceNumber] = useState("");

  useEffect(() => {
    const fetchSalesEntries = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const response = await axios.get("/api/reports/sales/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSales(response.data); // Set the sales data to state
      } catch (error) {
        console.error("Error fetching sales entries:", error);
        setError("Failed to fetch sales entries. Please try again later.");
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchSalesEntries();
  }, []);

  const handleEditClick = (sale) => {
    setEditingSale(sale);
    setUpdatedAmount(sale.amount);
    setUpdatedInvoiceNumber(sale.invoiceNumber);
  };

  const handleUpdateSale = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `/api/reports/sales/list`,
        {
          id: editingSale._id,
          amount: updatedAmount,
          invoiceNumber: updatedInvoiceNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state to reflect changes
      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale._id === editingSale._id
            ? {
                ...sale,
                amount: updatedAmount,
                invoiceNumber: updatedInvoiceNumber,
              }
            : sale
        )
      );

      // Reset editing state
      setEditingSale(null);
      setUpdatedAmount("");
      setUpdatedInvoiceNumber("");
    } catch (error) {
      console.error("Error updating sale entry:", error);
      setError("Failed to update sale entry. Please try again.");
    }
  };

  if (loading) return <p>Loading sales entries...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Sales Entries</h1>
        {sales.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Invoice Number</th>
                <th className="border border-gray-300 p-2">Sale Amount</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td className="border border-gray-300 p-2">
                    {sale.invoiceNumber}
                  </td>
                  <td className="border border-gray-300 p-2">${sale.amount}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEditClick(sale)}
                      className="bg-blue-600 text-white p-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No sales entries found.</p>
        )}

        {editingSale && (
          <div className="mt-6 p-4 border rounded border-gray-300">
            <h2 className="text-lg font-semibold mb-2">Edit Sale Entry</h2>
            <form
              onSubmit={handleUpdateSale}
              className="flex flex-col space-y-2"
            >
              <input
                type="number"
                value={updatedAmount}
                onChange={(e) => setUpdatedAmount(e.target.value)}
                placeholder="Sale Amount"
                className="input p-2 border rounded"
                required
              />
              <input
                type="text"
                value={updatedInvoiceNumber}
                onChange={(e) => setUpdatedInvoiceNumber(e.target.value)}
                placeholder="Invoice Number"
                className="input p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded"
              >
                Update Sale
              </button>
              <button
                type="button"
                onClick={() => setEditingSale(null)}
                className="bg-red-600 text-white p-2 rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
