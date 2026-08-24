import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Loader from "../components/common/Loader.jsx";

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/receipts");
        setReceipts(data.receipts);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load receipts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const copyLink = (receipt) => {
    const url = `${window.location.origin}/receipt/${receipt.token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(receipt._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Receipts</h1>

      {error && <div className="mb-4 text-danger text-sm">{error}</div>}

      {loading ? (
        <Loader label="Loading receipts..." />
      ) : receipts.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No receipts yet — receipts are created automatically whenever you record a sale.
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{r.saleId?.customerName}</td>
                  <td className="px-4 py-3 font-medium">₦{Number(r.saleId?.total || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link to={`/receipt/${r.token}`} className="text-brand hover:underline mr-4">
                      View Receipt
                    </Link>
                    <button onClick={() => copyLink(r)} className="text-gray-600 hover:underline">
                      {copiedId === r._id ? "Copied!" : "Copy link"}
                    </button>
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

export default Receipts;
