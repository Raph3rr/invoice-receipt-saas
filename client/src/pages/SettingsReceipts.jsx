import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";

const SettingsReceipts = () => {
  const [footerMessage, setFooterMessage] = useState("");
  const [showLogo, setShowLogo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/business");
        setFooterMessage(data.business.receiptSettings?.footerMessage || "");
        setShowLogo(data.business.receiptSettings?.showLogo ?? true);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load receipt settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.put("/business", { receiptSettings: { footerMessage, showLogo } });
      setSuccess("Receipt settings updated");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading receipt settings..." />;

  return (
    <div className="p-6 max-w-lg">
      <Link to="/settings" className="text-sm text-brand hover:underline">← Back to Settings</Link>
      <h1 className="text-xl font-semibold mt-3 mb-1">Receipt Branding</h1>
      <p className="text-sm text-gray-500 mb-6">This appears at the bottom of every receipt and invoice you share.</p>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-3 py-2">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-200 text-success text-sm px-3 py-2">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Footer message</label>
          <textarea
            value={footerMessage}
            onChange={(e) => setFooterMessage(e.target.value)}
            rows={2}
            placeholder="Thank you for your patronage!"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} />
          Show my business logo on receipts (once logo upload is available)
        </label>

        <Button type="submit" disabled={submitting} className="mt-2">
          {submitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
};

export default SettingsReceipts;
