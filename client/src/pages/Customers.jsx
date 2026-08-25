import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import Modal from "../components/common/Modal.jsx";
import Loader from "../components/common/Loader.jsx";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/customers");
      setCustomers(data.customers);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openModal = () => {
    setForm({ name: "", phone: "", email: "", address: "" });
    setFormError("");
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      setFormError("Name is required");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const { data } = await api.post("/customers", form);
      setCustomers((prev) => [...prev, data.customer].sort((a, b) => a.name.localeCompare(b.name)));
      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not add customer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Customers</h1>
        <Button onClick={openModal}>+ Add Customer</Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-4 py-3">{error}</div>
      )}

      {loading ? (
        <Loader label="Loading customers..." />
      ) : customers.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-400">
          <p>No customers yet.</p>
          <button onClick={openModal} className="text-brand hover:underline text-sm">
            Add your first customer
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{c.email || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/customers/${c._id}`} className="text-brand hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Customer">
        {formError && (
          <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-3 py-2">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />
          <Button type="submit" disabled={submitting} className="mt-1">
            {submitting ? "Adding..." : "Add Customer"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
