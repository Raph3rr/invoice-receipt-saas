import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";

const NewSale = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [cart, setCart] = useState([]); // [{ productId, name, price, quantity }]

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.products);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load products");
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = () => {
    if (!selectedProductId || selectedQty < 1) return;
    const product = products.find((p) => p._id === selectedProductId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id ? { ...item, quantity: item.quantity + Number(selectedQty) } : item
        );
      }
      return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: Number(selectedQty) }];
    });
    setSelectedProductId("");
    setSelectedQty(1);
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) {
      setError("Add at least one product to the sale");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/sales", {
        customerName: customerName || undefined,
        items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
      });
      navigate(`/receipt/${data.receipt.token}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) return <Loader label="Loading products..." />;

  if (!loadingProducts && products.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">New Sale</h1>
        <p className="text-gray-500 text-sm">
          You don't have any products yet.{" "}
          <button onClick={() => navigate("/products/new")} className="text-blue-600 hover:underline">
            Add a product first
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold mb-6">New Sale</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <Input
        label="Customer name (optional)"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="Walk-in customer"
      />

      <div className="flex items-end gap-3 mt-4">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Product</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id} disabled={p.quantity < 1}>
                {p.name} — ₦{Number(p.price).toLocaleString()} ({p.quantity} in stock)
              </option>
            ))}
          </select>
        </div>
        <div className="w-24">
          <Input
            label="Qty"
            type="number"
            min="1"
            value={selectedQty}
            onChange={(e) => setSelectedQty(e.target.value)}
          />
        </div>
        <Button type="button" variant="secondary" onClick={handleAddToCart}>
          Add
        </Button>
      </div>

      {cart.length > 0 && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Item</th>
                <th className="px-4 py-2 font-medium">Qty</th>
                <th className="px-4 py-2 font-medium">Subtotal</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.productId} className="border-t border-gray-100">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">₦{(item.price * item.quantity).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-gray-50 flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <Button onClick={handleSubmit} disabled={submitting || cart.length === 0}>
          {submitting ? "Recording sale..." : "Record Sale"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NewSale;
