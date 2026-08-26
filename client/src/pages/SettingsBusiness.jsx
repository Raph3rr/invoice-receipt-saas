import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";

const categories = [
  "Perfume", "Thrift / Fashion", "Shoes", "Cosmetics", "Phones / Electronics",
  "Computers", "Mini Supermarket", "Food", "Services", "Freelance", "Other",
];

const SettingsBusiness = () => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/business");
        setForm({
          name: data.business.name || "",
          category: data.business.category || "",
          description: data.business.description || "",
          phone: data.business.phone || "",
          email: data.business.email || "",
          address: data.business.address || "",
          city: data.business.city || "",
          state: data.business.state || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load business details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.put("/business", form);
      setSuccess("Business details updated");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading business details..." />;

  if (error && !form) {
    return (
      <div className="p-6">
        <p className="text-danger text-sm mb-3">{error}</p>
        <Link to="/onboarding" className="text-brand hover:underline text-sm">Finish business setup</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg">
      <Link to="/settings" className="text-sm text-brand hover:underline">← Back to Settings</Link>
      <h1 className="text-xl font-semibold mt-3 mb-6">Business Details</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-3 py-2">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-200 text-success text-sm px-3 py-2">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Business name" name="name" value={form.name} onChange={handleChange} required />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Business email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>

        <Input label="Address" name="address" value={form.address} onChange={handleChange} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="City" name="city" value={form.city} onChange={handleChange} />
          <Input label="State" name="state" value={form.state} onChange={handleChange} />
        </div>

        <Button type="submit" disabled={submitting} className="mt-2">
          {submitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
};

export default SettingsBusiness;
