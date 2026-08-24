import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSales = async () => {
      try {
        const { data } = await api.get("/sales");
        setSales(data.sales);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load sales");
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Sales</h1>
        <Link to="/sales/new">
          <Button>+ New Sale</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <Loader label="Loading sales..." />
      ) : sales.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-400">
          <p>No sales recorded yet.</p>
          <Link to="/sales/new" className="text-brand hover:underline text-sm">
            Record your first sale
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{new Date(s.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{s.customerName}</td>
                  <td className="px-4 py-3">{s.items.length} item{s.items.length !== 1 ? "s" : ""}</td>
                  <td className="px-4 py-3 font-medium">₦{Number(s.total).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/sales/${s._id}`} className="text-brand hover:underline">
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
    </div>
  );
};

export default Sales;
