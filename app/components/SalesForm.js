// bm-day-book/app/components/SalesForm.js
import { useState } from "react";

export default function SalesForm({ onSubmit, loading }) {
  const [saleAmount, setSaleAmount] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass data to the parent component via the onSubmit prop
    onSubmit({ saleAmount, invoiceNumber });
    // Reset form fields after submission
    setSaleAmount("");
    setInvoiceNumber("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 p-4">
      <input
        type="number"
        placeholder="Sale Amount"
        value={saleAmount}
        onChange={(e) => setSaleAmount(e.target.value)}
        className="input p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Invoice Number"
        value={invoiceNumber}
        onChange={(e) => setInvoiceNumber(e.target.value)}
        className="input p-2 border rounded"
        required
      />
      <button
        type="submit"
        className={`bg-blue-600 text-white p-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading} // Disable button if loading
      >
        {loading ? "Submitting..." : "Submit Sale"}
      </button>
    </form>
  );
}
