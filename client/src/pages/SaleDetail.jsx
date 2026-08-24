import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api.js";
import Loader from "../components/common/Loader.jsx";

const SaleDetail = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSale = async () => {
      try {
        const { data } = await api.get(`/sales/${id}`);
        setSale(data.sale);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load sale");
      } finally {
        setLoading(false);
      }
    };
    loadSale();
  }, [id]);

  if (loading) return <Loader label="Loading sale..." />;
  if (error) return <div className="p-6 text-danger text-sm">{error}</div>;
  if (!sale) return null;

  return (
    <div className="p-6 max-w-lg">
      <Link to="/sales" className="text-sm text-brand hover:underline">
        ← Back to Sales
      </Link>

      <h1 className="text-xl font-semibold mt-3 mb-1">Sale Receipt</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(sale.createdAt).toLocaleString()} · {sale.customerName}
      </p>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Item</th>
              <th className="px-4 py-2 font-medium">Qty</th>
              <th className="px-4 py-2 font-medium">Price</th>
              <th className="px-4 py-2 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">₦{Number(item.price).toLocaleString()}</td>
                <td className="px-4 py-2">₦{Number(item.subtotal).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>₦{Number(sale.total).toLocaleString()}</span>
        </div>
      </div>

      <p className="text-gray-400 text-xs mt-6">
        A shareable, printable receipt (PDF/link) will be built in the Receipts phase.
      </p>
    </div>
  );
};

export default SaleDetail;
