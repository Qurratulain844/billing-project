import { useEffect, useState } from "react";
import API from "../services/api";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);

  const [rowLimit, setRowLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const res = await API.get("invoices/");
    setInvoices(res.data);
  };

  // 🔍 SEARCH + FILTER LOGIC
  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer_name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" || inv.payment_status === statusFilter;

    return matchSearch && matchStatus;
  });

  // 📊 LIMIT
  const displayedInvoices =
    rowLimit === "ALL"
      ? filteredInvoices
      : filteredInvoices.slice(0, rowLimit);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <h1 className="text-2xl font-semibold">Invoice List</h1>

        <div className="flex flex-wrap gap-3">

          {/* 🔍 SEARCH */}
          <input
            type="text"
            placeholder="Search invoice or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-64"
          />

          {/* 🎯 STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="ALL">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="UNPAID">Unpaid</option>
          </select>

          {/* 📊 ROW LIMIT */}
          <select
            value={rowLimit}
            onChange={(e) =>
              setRowLimit(
                e.target.value === "ALL"
                  ? "ALL"
                  : parseInt(e.target.value)
              )
            }
            className="border p-2 rounded"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value="ALL">All</option>
          </select>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="min-w-full text-sm">

          {/* HEADER */}
          <thead className="bg-teal-600 text-white text-left">
            <tr>
              <th className="px-4 py-3">Invoice No</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Subtotal</th>
              <th className="px-4 py-3">GST %</th>
              <th className="px-4 py-3">GST Amount</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {displayedInvoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-semibold">
                  {inv.invoice_number}
                </td>

                <td className="px-4 py-3">
                  {inv.customer_name}
                </td>

                <td className="px-4 py-3">
                  ₹ {inv.subtotal}
                </td>

                <td className="px-4 py-3">
                  {inv.gst_percent}%
                </td>

                <td className="px-4 py-3">
                  ₹ {inv.gst_amount}
                </td>

                <td className="px-4 py-3 font-semibold">
                  ₹ {inv.total_amount}
                </td>

                <td className="px-4 py-3">
                  ₹ {inv.paid_amount}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inv.payment_status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : inv.payment_status === "PARTIAL"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {inv.payment_status}
                  </span>
                </td>
              </tr>
            ))}

            {/* ❗ NO DATA */}
            {displayedInvoices.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}