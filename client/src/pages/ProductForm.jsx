import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";

const ProductForm = () => {
  const { id } = useParams(); // present only when editing
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", price: "", quantity: "", category: "" });
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    const loadProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setForm({
          name: data.product.name,
          price: data.product.price,
          quantity: data.product.quantity,
          category: data.product.category || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load product");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        quantity: Number(form.quantity) || 0,
        category: form.category,
      };
      if (isEditing) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading product..." />;

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-semibold mb-6">{isEditing ? "Edit Product" : "Add Product"}</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Product name" name="name" value={form.name} onChange={handleChange} required />
        <Input
          label="Price (₦)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />
        <Input
          label="Quantity in stock"
          name="quantity"
          type="number"
          min="0"
          value={form.quantity}
          onChange={handleChange}
        />
        <Input label="Category (optional)" name="category" value={form.category} onChange={handleChange} />

        <div className="flex gap-3 mt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEditing ? "Save changes" : "Add product"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
