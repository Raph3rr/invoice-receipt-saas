import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import api from "../services/api.js";
import Loader from "../components/common/Loader.jsx";
import Button from "../components/common/Button.jsx";

// Every receipt uses the app's brand color as its accent.
const RECEIPT_ACCENT = {
  bg: "#2563EB",
  light: "#EFF6FF",
};

const PublicReceipt = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const receiptRef = useRef(null);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [shareSupported, setShareSupported] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    // We need both navigator.share and navigator.canShare
    // because we are sharing an image file.
    const canShareFiles =
      Boolean(navigator.share) && Boolean(navigator.canShare);

    setShareSupported(canShareFiles);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/receipts/public/${token}`);

        setData(data.receipt);
      } catch (err) {
        setError(
          err.response?.data?.message || "This receipt could not be found",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  // Share the receipt as an actual image.
  const handleShare = async () => {
    if (!receiptRef.current || !data || sharing) return;

    try {
      setSharing(true);

      // Capture only the actual receipt.
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Convert the canvas to a PNG blob.
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      if (!blob) {
        throw new Error("Could not create receipt image.");
      }

      const file = new File([blob], `sellza-receipt-${token.slice(0, 8)}.png`, {
        type: "image/png",
      });

      // Make sure the browser supports sharing files.
      if (
        !navigator.share ||
        !navigator.canShare ||
        !navigator.canShare({ files: [file] })
      ) {
        alert("Your browser does not support sharing the receipt image.");
        return;
      }

      // IMPORTANT:
      // No URL is included here.
      // The receipt is shared as an image file.
      await navigator.share({
        title: `Receipt from ${data.business.name}`,
        text: `Receipt from ${data.business.name}`,
        files: [file],
      });
    } catch (err) {
      // User cancelled the share sheet.
      if (err?.name !== "AbortError") {
        console.error("Failed to share receipt:", err);
      }
    } finally {
      setSharing(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/receipts/public/${token}`);
        setData(data.receipt);
      } catch (err) {
        setError(
          err.response?.data?.message || "This receipt could not be found",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  if (loading) {
    return <Loader label="Loading receipt..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm p-6">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { business, sale } = data;

  const accent = RECEIPT_ACCENT;
  const receiptNo = token.slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4 print:bg-white print:py-0 flex justify-center">
      <div className="w-full max-w-sm">
        {/* =====================================================
            RECEIPT
            This entire element is captured by html2canvas.
        ====================================================== */}
        <div
          ref={receiptRef}
          className="bg-white rounded-t-xl shadow-lg print:shadow-none overflow-hidden"
        >
          {/* Header */}
          <div
            className="px-6 pt-6 pb-8 text-center text-white"
            style={{ backgroundColor: accent.bg }}
          >
            <div
              className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 text-lg font-bold"
              style={{ letterSpacing: "0.5px" }}
            >
              {business.name?.charAt(0)?.toUpperCase() || "?"}
            </div>

            <h1 className="text-lg font-bold tracking-wide">{business.name}</h1>

            {business.address && (
              <p className="text-xs text-white/80 mt-1">{business.address}</p>
            )}

            {(business.city || business.state) && (
              <p className="text-xs text-white/80">
                {business.city}
                {business.city && business.state ? ", " : ""}
                {business.state}
              </p>
            )}

            {business.phone && (
              <p className="text-xs text-white/80">{business.phone}</p>
            )}
          </div>

          {/* Receipt body */}
          <div className="px-6 pt-5 pb-6 -mt-4 bg-white rounded-t-2xl relative">
            {/* Receipt number and status */}
            <div className="flex justify-between text-[11px] text-gray-400 uppercase tracking-wider mb-1">
              <span>Receipt #{receiptNo}</span>

              <span className="font-semibold" style={{ color: "#16A34A" }}>
                Paid
              </span>
            </div>

            {/* Date */}
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>{new Date(sale.createdAt).toLocaleString()}</span>
            </div>

            {/* Customer */}
            <div className="text-xs text-gray-500 mb-3">
              Billed to{" "}
              <span className="font-medium text-gray-700">
                {sale.customerName}
              </span>
            </div>

            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* Items */}
            <table className="w-full text-sm font-mono">
              <tbody>
                {sale.items.map((item, i) => (
                  <tr key={i} className="align-top">
                    <td className="py-1.5 pr-2">
                      <div className="text-gray-800">{item.name}</div>

                      <div className="text-[11px] text-gray-400">
                        {item.quantity} × ₦{Number(item.price).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-1.5 text-right align-top text-gray-800 whitespace-nowrap">
                      ₦{Number(item.subtotal).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-gray-700">Total</span>

              <span className="text-xl font-bold" style={{ color: accent.bg }}>
                ₦{Number(sale.total).toLocaleString()}
              </span>
            </div>

            {/* Business footer */}
            {business.receiptSettings?.footerMessage && (
              <p className="text-center text-xs text-gray-400 mt-6 italic">
                {business.receiptSettings.footerMessage}
              </p>
            )}

            {/* SELLZA Branding */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Powered by</p>

              <p
                className="text-base font-extrabold tracking-tight"
                style={{ color: accent.bg }}
              >
                SELLZA
              </p>

              <p className="text-[10px] text-gray-400 mt-0.5">
                Sell smarter. Track everything.
              </p>
            </div>
          </div>
        </div>

        {/* Torn-paper edge */}
        <div
          className="h-4 w-full print:hidden"
          style={{
            background: "white",
            clipPath:
              "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)",
          }}
        />

        {/* Actions */}
        <div className="print:hidden flex flex-col gap-2 mt-6">
          {/* Back to Receipts */}
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => navigate("/receipts")}
          >
            ← Back to Receipts
          </Button>

          {/* Share Receipt as IMAGE */}
          {shareSupported && (
            <Button className="w-full" onClick={handleShare} disabled={sharing}>
              {sharing ? "Preparing Receipt..." : "Share Receipt"}
            </Button>
          )}

          {/* Print */}
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => window.print()}
          >
            Print / Save as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicReceipt;
