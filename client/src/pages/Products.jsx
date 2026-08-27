import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [threshold, setThreshold] = useState(5);
  const [thresholdInput, setThresholdInput] = useState("5");
  const [savingThreshold, setSavingThreshold] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [productsRes, businessRes] = await Promise.allSettled([api.get("/products"), api.get("/business")]);
      if (productsRes.status === "fulfilled") setProducts(productsRes.value.data.products);
      else setError(productsRes.reason?.response?.data?.message || "Could not load products");

      if (businessRes.status === "fulfilled") {
        const t = businessRes.value.data.business.lowStockThreshold ?? 5;
        setThreshold(t);
        setThresholdInput(String(t));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete product");
    }
  };

  const handleSaveThreshold = async () => {
    const value = Number(thresholdInput);
    if (Number.isNaN(value) || value < 0) return;
    setSavingThreshold(true);
    try {
      await api.put("/business", { lowStockThreshold: value });
      setThreshold(value);
    } catch (err) {
      alert(err.response?.data?.message || "Could not save alert setting");
    } finally {
      setSavingThreshold(false);
    }
  };

  const lowStockProducts = products.filter((p) => p.quantity <= threshold);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link to="/products/new">
          <Button>+ Add Product</Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 w-full sm:w-fit">
        <span className="text-gray-600">Notify me when stock reaches</span>
        <input
          type="number"
          min="0"
          value={thresholdInput}
          onChange={(e) => setThresholdInput(e.target.value)}
          className="w-16 rounded border border-gray-300 px-2 py-1 text-center"
        />
        <span className="text-gray-600">units or fewer</span>
        <button
          onClick={handleSaveThreshold}
          disabled={savingThreshold || Number(thresholdInput) === threshold}
          className="text-brand hover:underline disabled:text-gray-300 disabled:no-underline ml-1"
        >
          {savingThreshold ? "Saving..." : "Save"}
        </button>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-4 py-3">
          <strong>{lowStockProducts.length}</strong> product{lowStockProducts.length !== 1 ? "s are" : " is"} at or
          below your low-stock threshold: {lowStockProducts.map((p) => p.name).join(", ")}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>{error}</span>
          {error.includes("business") && (
            <Button variant="secondary" onClick={() => navigate("/onboarding")}>
              Finish setup
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <Loader label="Loading products..." />
      ) : products.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-400">
          <p>No products yet.</p>
          <Link to="/products/new" className="text-brand hover:underline text-sm">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isLow = p.quantity <= threshold;
                return (
                  <tr key={p._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-8 w-8 rounded object-cover border border-gray-200" />
                        ) : (
                          <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-300 text-[9px]">
                            —
                          </div>
                        )}
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category || "—"}</td>
                    <td className="px-4 py-3">₦{Number(p.price).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <span className={isLow ? "text-danger font-medium" : ""}>{p.quantity}</span>
                        {isLow && (
                          <span className="text-[11px] leading-none whitespace-nowrap bg-red-100 text-danger px-2 py-1 rounded-full">
                            Low stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/products/${p._id}/edit`} className="text-brand hover:underline mr-4">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="text-danger hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
