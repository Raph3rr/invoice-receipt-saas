import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.products);
        try {
          const custRes = await api.get("/customers");
          setCustomers(custRes.data.customers);
        } catch (custErr) {
          // fine to continue without saved customers
        }
      } catch (err) {
        // fine to continue with an empty catalog — custom line items still work
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddProduct = () => {
    if (!selectedProductId || selectedQty < 1) return;
    const product = products.find((p) => p._id === selectedProductId);
    if (!product) return;
    setCart((prev) => [
      ...prev,
      { key: `${product._id}-${Date.now()}`, productId: product._id, name: product.name, price: product.price, quantity: Number(selectedQty) },
    ]);
    setSelectedProductId("");
    setSelectedQty(1);
  };

  const handleAddCustom = () => {
    if (!customName || !customPrice || selectedQty < 1) return;
    setCart((prev) => [
      ...prev,
      { key: `custom-${Date.now()}`, productId: null, name: customName, price: Number(customPrice), quantity: Number(selectedQty) },
    ]);
    setCustomName("");
    setCustomPrice("");
    setSelectedQty(1);
  };

  const handleRemove = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!customerName || !dueDate) {
      setError("Customer name and due date are required");
      return;
    }
    if (cart.length === 0) {
      setError("Add at least one item to the invoice");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/invoices", {
        customerId: selectedCustomerId || undefined,
        customerName,
        customerEmail: customerEmail || undefined,
        customerPhone: customerPhone || undefined,
        dueDate,
        notes: notes || undefined,
        items: cart.map(({ productId, name, price, quantity }) => ({ productId, name, price, quantity })),
      });
      navigate(`/invoice/${data.invoice.token}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) return <Loader label="Loading..." />;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold mb-6">New Invoice</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {customers.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Select a saved customer (optional)</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                const custId = e.target.value;
                setSelectedCustomerId(custId);
                const found = customers.find((c) => c._id === custId);
                if (found) {
                  setCustomerName(found.name);
                  setCustomerEmail(found.email || "");
                  setCustomerPhone(found.phone || "");
                }
              }}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Type a new customer below</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Customer name"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (selectedCustomerId) setSelectedCustomerId("");
            }}
            required
          />
          <Input label="Due date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Customer email (optional)" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
          <Input label="Customer phone (optional)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
        </div>

        <div className="border-t border-gray-200 pt-4 mt-2">
          <p className="text-sm font-medium text-gray-700 mb-3">Add items</p>

          {products.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs text-gray-500">From your products</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — ₦{Number(p.price).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-20">
                <Input label="Qty" type="number" min="1" value={selectedQty} onChange={(e) => setSelectedQty(e.target.value)} />
              </div>
              <Button type="button" variant="secondary" onClick={handleAddProduct}>
                Add
              </Button>
            </div>
          )}

          <p className="text-xs text-gray-400 mb-2">Or add a custom line item (e.g. a service):</p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1">
              <Input label="Description" value={customName} onChange={(e) => setCustomName(e.target.value)} />
            </div>
            <div className="w-full sm:w-28">
              <Input label="Price (₦)" type="number" min="0" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} />
            </div>
            <Button type="button" variant="secondary" onClick={handleAddCustom}>
              Add
            </Button>
          </div>
        </div>

        {cart.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-2">
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {cart.map((item) => (
                  <tr key={item.key} className="border-t border-gray-100 first:border-0">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2 text-gray-500">×{item.quantity}</td>
                    <td className="px-4 py-2">₦{(item.price * item.quantity).toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">
                      <button type="button" onClick={() => handleRemove(item.key)} className="text-danger hover:underline">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Payment terms, bank details, etc."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <Button type="submit" disabled={submitting || cart.length === 0}>
            {submitting ? "Creating..." : "Create Invoice"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/invoices")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
