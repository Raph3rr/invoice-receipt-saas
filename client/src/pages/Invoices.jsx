import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";

const StatusBadge = ({ invoice }) => {
  const isOverdue = invoice.status === "unpaid" && new Date(invoice.dueDate) < new Date();
  if (invoice.status === "paid") {
    return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Paid</span>;
  }
  if (isOverdue) {
    return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Overdue</span>;
  }
  return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Unpaid</span>;
};

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingId, setMarkingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/invoices");
      setInvoices(data.invoices);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkPaid = async (id) => {
    setMarkingId(id);
    try {
      await api.post(`/invoices/${id}/payment`);
      setInvoices((prev) => prev.map((inv) => (inv._id === id ? { ...inv, status: "paid" } : inv)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update invoice");
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <Link to="/invoices/new">
          <Button>+ New Invoice</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>
      )}

      {loading ? (
        <Loader label="Loading invoices..." />
      ) : invoices.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-400">
          <p>No invoices yet.</p>
          <Link to="/invoices/new" className="text-blue-600 hover:underline text-sm">
            Create your first invoice
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Due Date</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{inv.customerName}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium">₦{Number(inv.total).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge invoice={inv} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link to={`/invoice/${inv.token}`} className="text-blue-600 hover:underline mr-4">
                      View
                    </Link>
                    {inv.status !== "paid" && (
                      <button
                        onClick={() => handleMarkPaid(inv._id)}
                        disabled={markingId === inv._id}
                        className="text-green-600 hover:underline disabled:text-gray-300"
                      >
                        {markingId === inv._id ? "Saving..." : "Mark Paid"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Invoices;
