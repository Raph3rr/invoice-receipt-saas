import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api.js";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";

const ReceiptDetail = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/receipts/${id}`);
        setReceipt(data.receipt);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load receipt");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader label="Loading receipt..." />;
  if (error) return <div className="p-6 text-red-600 text-sm">{error}</div>;
  if (!receipt) return null;

  const publicUrl = `${window.location.origin}/receipt/${receipt.token}`;
  const sale = receipt.saleId;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-lg">
      <Link to="/receipts" className="text-sm text-blue-600 hover:underline">
        ← Back to Receipts
      </Link>

      <h1 className="text-xl font-semibold mt-3 mb-1">Receipt</h1>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(sale.createdAt).toLocaleString()} · {sale.customerName}
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <p className="text-sm text-blue-800 mb-2">Share this link with your customer:</p>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={publicUrl}
            className="flex-1 text-sm bg-white border border-blue-200 rounded px-2 py-1.5 text-gray-600"
            onFocus={(e) => e.target.select()}
          />
          <Button type="button" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-700 hover:underline mt-2 inline-block">
          Open public receipt page →
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Item</th>
              <th className="px-4 py-2 font-medium">Qty</th>
              <th className="px-4 py-2 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">₦{Number(item.subtotal).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>₦{Number(sale.total).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetail;
