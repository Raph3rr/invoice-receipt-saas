import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";

const categories = [
  "Perfume", "Thrift / Fashion", "Shoes", "Cosmetics", "Phones / Electronics",
  "Computers", "Mini Supermarket", "Food", "Services", "Freelance", "Other",
];

const Onboarding = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    footerMessage: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/business", form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-semibold mb-1">Set up your business</h1>
        <p className="text-sm text-gray-500 mb-6">
          This information appears on your receipts and invoices. You can change it later in Settings.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Business name" name="name" value={form.name} onChange={handleChange} required />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Business email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>

          <Input label="Address" name="address" value={form.address} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="City" name="city" value={form.city} onChange={handleChange} />
            <Input label="State" name="state" value={form.state} onChange={handleChange} />
          </div>

          <Input
            label="Receipt footer message (optional)"
            name="footerMessage"
            value={form.footerMessage}
            onChange={handleChange}
            placeholder="Thank you for your patronage!"
          />

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Saving..." : "Finish setup"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
