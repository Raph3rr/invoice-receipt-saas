import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import Modal from "../components/common/Modal.jsx";
import Loader from "../components/common/Loader.jsx";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/customers/${id}`);
      setCustomer(data.customer);
      setSales(data.sales);
      setInvoices(data.invoices);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load customer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openEdit = () => {
    setForm({
      name: customer.name,
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
    });
    setFormError("");
    setEditOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const { data } = await api.put(`/customers/${id}`, form);
      setCustomer(data.customer);
      setEditOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not update customer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${customer.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/customers/${id}`);
      navigate("/customers");
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete customer");
    }
  };

  if (loading) return <Loader label="Loading customer..." />;
  if (error) return <div className="p-6 text-danger text-sm">{error}</div>;
  if (!customer) return null;

  return (
    <div className="p-6 max-w-2xl">
      <Link to="/customers" className="text-sm text-brand hover:underline">
        ← Back to Customers
      </Link>

      <div className="flex items-start justify-between mt-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">{customer.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{customer.phone || "No phone"} · {customer.email || "No email"}</p>
          {customer.address && <p className="text-sm text-gray-400 mt-1">{customer.address}</p>}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={openEdit}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-700 mb-3">Sales History</h2>
      {sales.length === 0 ? (
        <p className="text-gray-400 text-sm mb-6">No sales recorded for this customer yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          {sales.map((s) => (
            <Link
              key={s._id}
              to={s.receiptToken ? `/receipt/${s.receiptToken}` : "/receipts"}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 text-sm hover:bg-gray-50"
            >
              <span>{new Date(s.createdAt).toLocaleDateString()} · {s.items.length} item{s.items.length !== 1 ? "s" : ""}</span>
              <span className="font-medium">₦{Number(s.total).toLocaleString()}</span>
            </Link>
          ))}
        </div>
      )}

      <h2 className="text-sm font-semibold text-gray-700 mb-3">Invoice History</h2>
      {invoices.length === 0 ? (
        <p className="text-gray-400 text-sm">No invoices for this customer yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {invoices.map((inv) => (
            <Link
              key={inv._id}
              to={`/invoice/${inv.token}`}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 text-sm hover:bg-gray-50"
            >
              <span>{new Date(inv.createdAt).toLocaleDateString()} · {inv.status}</span>
              <span className="font-medium">₦{Number(inv.total).toLocaleString()}</span>
            </Link>
          ))}
        </div>
      )}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Customer">
        {formError && (
          <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-3 py-2">
            {formError}
          </div>
        )}
        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />
          <Button type="submit" disabled={submitting} className="mt-1">
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerDetail;
