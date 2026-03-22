import { useEffect, useState } from "react";
import { HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import API from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    gst_number: "",
  });

  const fetchCustomers = async () => {
    const res = await API.get("customers/");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await API.put(`customers/${editingId}/`, formData);
    } else {
      await API.post("customers/", formData);
    }

    setFormData({ name: "", phone: "", address: "", gst_number: "" });
    setEditingId(null);
    setFormOpen(false);
    fetchCustomers();
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingId(customer.id);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await API.delete(`customers/${id}/`);
    fetchCustomers();
  };

  const filteredCustomers = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalOutstanding = customers.reduce(
    (sum, c) => sum + parseFloat(c.total_due || 0),
    0
  );

  return (
    <div className="p-4 md:p-8">

      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Customers
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Manage clients and outstanding balances
          </p>
        </div>

        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition"
        >
          <HiPlus /> New Customer
        </button>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow border">
          <p className="text-gray-500 text-sm">Total Customers</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            {customers.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border">
          <p className="text-gray-500 text-sm">Total Outstanding</p>
          <h2 className="text-3xl md:text-4xl font-bold text-red-500 mt-2">
            ₹ {totalOutstanding.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      {/* ===== MOBILE CARDS ===== */}
      <div className="md:hidden space-y-4">
        {filteredCustomers.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow p-5 border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-500">{c.phone}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(c)}
                  className="text-blue-600"
                >
                  <HiPencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-600"
                >
                  <HiTrash size={18} />
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">GST:</span> {c.gst_number || "-"}</p>
              <p><span className="font-medium">Address:</span> {c.address}</p>
              <p className="text-red-500 font-semibold mt-2">
                ₹ {c.total_due}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block bg-white rounded-2xl shadow border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">GST</th>
              <th className="p-4">Address</th>
              <th className="p-4">Due</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-semibold">{c.name}</td>
                <td className="p-4">{c.phone}</td>
                <td className="p-4">{c.gst_number || "-"}</td>
                <td className="p-4">{c.address}</td>
                <td className="p-4 font-semibold text-red-500">
                  ₹ {c.total_due}
                </td>
                <td className="p-4 flex gap-4">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600"
                  >
                    <HiPencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600"
                  >
                    <HiTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MODAL ===== */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "Edit Customer" : "Add Customer"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Customer Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
                required
              />

              <input
                type="text"
                name="gst_number"
                placeholder="GST Number"
                value={formData.gst_number || ""}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl"
                >
                  {editingId ? "Update" : "Create"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setEditingId(null);
                  }}
                  className="flex-1 bg-gray-200 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
