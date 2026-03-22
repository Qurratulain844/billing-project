import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function InvoicePrint() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [company, setCompany] = useState(null);
  const [variants, setVariants] = useState([]);
  const [customers, setCustomers] = useState([]); // ✅ ADD

  useEffect(() => {
    fetchInvoice();
    fetchCompany();
    fetchVariants();
    fetchCustomers(); // ✅ ADD
  }, []);

  const fetchInvoice = async () => {
    try {
      const res = await API.get(`invoices/${id}/`);
      setInvoice(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompany = async () => {
    try {
      const res = await API.get("company/");
      setCompany(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVariants = async () => {
    try {
      const res = await API.get("variants/");
      setVariants(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await API.get("customers/");
      setCustomers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ PRODUCT NAME
  const getVariantName = (id) => {
    const v = variants.find(v => v.id === id);
    return v ? v.display_name : "Product";
  };

  // ✅ CUSTOMER AUTO-FILL (LIKE CREATE INVOICE)
  const selectedCustomer = customers.find(
    c => c.id === invoice?.customer
  );

  const handlePrint = () => {
    window.print();
  };

  if (!invoice) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white">

      {/* Buttons */}
      <div className="flex justify-between mb-6 print:hidden">

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          ← Back
        </button>

        <button
          onClick={handlePrint}
          className="bg-teal-600 text-white px-4 py-2 rounded"
        >
          Print Invoice
        </button>

      </div>

      {/* COMPANY HEADER */}
      <div className="border-b pb-6 mb-6 flex items-center justify-between">

        <div className="flex items-center gap-4">

          {company?.logo && (
            <img
              src={
                company.logo.startsWith("http")
                  ? company.logo
                  : `http://127.0.0.1:8000${company.logo}`
              }
              alt="logo"
              className="h-20"
            />
          )}

          <div>
            <h2 className="text-2xl font-bold">
              {company?.name}
            </h2>
            <p>{company?.address}</p>
            <p>{company?.phone}</p>
          </div>

        </div>

        <div className="text-right">
          <h1 className="text-3xl font-bold text-teal-600">
            INVOICE
          </h1>
          <p>No: {invoice.invoice_number}</p>
          <p>{new Date(invoice.date).toLocaleDateString()}</p>
        </div>

      </div>

      {/* ✅ BILL TO (AUTO LIKE CREATE INVOICE) */}
      <div className="mb-6 bg-gray-50 p-4 rounded">

        <h3 className="text-sm text-gray-500 mb-1">
          Bill To
        </h3>

        <p className="font-semibold text-lg">
          {selectedCustomer?.name || "-"}
        </p>

        <p>
          {selectedCustomer?.phone || "-"}
        </p>

        <p>
          {selectedCustomer?.address || "-"}
        </p>

      </div>

      {/* ITEMS */}
      <table className="w-full border mb-6">

        <thead className="bg-teal-600 text-white">
          <tr>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-center">Qty</th>
            <th className="p-2 text-right">Price</th>
            <th className="p-2 text-right">Amount</th>
          </tr>
        </thead>

        <tbody>

          {invoice.items?.map((item) => (

            <tr key={item.id} className="border-t">

              <td className="p-2">
                {getVariantName(item.product_variant)}
              </td>

              <td className="p-2 text-center">
                {item.quantity}
              </td>

              <td className="p-2 text-right">
                ₹ {parseFloat(item.price).toFixed(2)}
              </td>

              <td className="p-2 text-right">
                ₹ {parseFloat(item.total).toFixed(2)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* TOTALS */}
      <div className="flex justify-end">

        <div className="w-72 space-y-2">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {parseFloat(invoice.subtotal).toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>GST ({invoice.gst_percent}%)</span>
            <span>₹ {parseFloat(invoice.gst_amount).toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>₹ {parseFloat(invoice.total_amount).toFixed(2)}</span>
          </div>

        </div>

      </div>

    </div>
  );
}