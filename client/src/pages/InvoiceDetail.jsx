import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import api from "../services/api.js";
import Loader from "../components/common/Loader.jsx";
import Button from "../components/common/Button.jsx";

// Same fixed brand accent as receipts, for consistent branding across the app.
const INVOICE_ACCENT = { bg: "#2563EB" };

const InvoiceDetail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // Reference to the actual invoice card.
  // html2canvas uses this to generate the invoice image.
  const invoiceRef = useRef(null);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [shareSupported, setShareSupported] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setShareSupported(
      Boolean(
        navigator.share && navigator.canShare && typeof File !== "undefined",
      ),
    );
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/invoices/public/${token}`);

        setData(data.invoice);
      } catch (err) {
        setError(
          err.response?.data?.message || "This invoice could not be found",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  /*
   * Generate an image from the invoice card.
   */
  const generateInvoiceImage = async () => {
    if (!invoiceRef.current) {
      throw new Error("Invoice is not ready yet.");
    }

    const canvas = await html2canvas(invoiceRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    return canvas;
  };

  /*
   * Share the actual invoice IMAGE.
   *
   * This does NOT share window.location.href.
   */
  const handleShare = async () => {
    if (!data || !invoiceRef.current) return;

    try {
      setSharing(true);

      const canvas = await generateInvoiceImage();

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (!blob) {
        throw new Error("Could not create invoice image.");
      }

      const fileName = `invoice-${token.slice(0, 8).toUpperCase()}.png`;

      const file = new File([blob], fileName, {
        type: "image/png",
      });

      // Make sure the browser supports sharing files.
      if (
        !navigator.share ||
        !navigator.canShare ||
        !navigator.canShare({ files: [file] })
      ) {
        // If image sharing is unavailable, download the image instead.
        const imageUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(imageUrl);

        return;
      }

      await navigator.share({
        title: `Invoice from ${data.business.name}`,
        text: `Invoice from ${
          data.business.name
        }. Amount due: ₦${Number(data.total).toLocaleString()}`,
        files: [file],
      });
    } catch (err) {
      // User cancelled the share sheet.
      if (err.name !== "AbortError") {
        console.error("Invoice sharing failed:", err);
      }
    } finally {
      setSharing(false);
    }
  };

  /*
   * Download the invoice as a PNG image.
   */
  const handleDownload = async () => {
    if (!data || !invoiceRef.current) return;

    try {
      setDownloading(true);

      const canvas = await generateInvoiceImage();

      const imageUrl = canvas.toDataURL("image/png");

      const fileName = `invoice-${token.slice(0, 8).toUpperCase()}.png`;

      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Invoice download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <Loader label="Loading invoice..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm p-6">
        {error}
      </div>
    );
  }

  const {
    business,
    customerName,
    items,
    total,
    dueDate,
    status,
    isOverdue,
    notes,
    createdAt,
  } = data;

  const accent = INVOICE_ACCENT;

  const statusLabel =
    status === "paid" ? "Paid" : isOverdue ? "Overdue" : "Unpaid";

  const statusColor =
    status === "paid" ? "#16A34A" : isOverdue ? "#DC2626" : "#d97706";

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4 print:bg-white print:py-0 flex justify-center">
      <div className="w-full max-w-sm">
        {/* 
          EVERYTHING INSIDE THIS REF IS CAPTURED
          WHEN SHARING OR DOWNLOADING THE INVOICE.
        */}
        <div
          ref={invoiceRef}
          className="bg-white rounded-xl shadow-lg print:shadow-none overflow-hidden"
        >
          {/* Invoice Header */}
          <div
            className="px-6 pt-6 pb-8 text-white"
            style={{ backgroundColor: accent.bg }}
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold">{business.name}</h1>

              <span
                className="text-xs font-semibold px-2 py-1 rounded-full bg-white"
                style={{ color: statusColor }}
              >
                {statusLabel}
              </span>
            </div>

            {business.address && (
              <p className="text-xs text-white/80">{business.address}</p>
            )}

            {business.phone && (
              <p className="text-xs text-white/80">{business.phone}</p>
            )}
          </div>

          {/* Invoice Content */}
          <div className="px-6 pt-5 pb-6 -mt-4 bg-white rounded-t-2xl">
            {/* Invoice Date */}
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Invoice date</span>

              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>

            {/* Due Date */}
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>Due date</span>

              <span className={isOverdue ? "text-danger font-medium" : ""}>
                {new Date(dueDate).toLocaleDateString()}
              </span>
            </div>

            {/* Customer */}
            <div className="text-xs text-gray-500 mb-3">
              Billed to{" "}
              <span className="font-medium text-gray-700">{customerName}</span>
            </div>

            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* Items */}
            <table className="w-full text-sm font-mono">
              <tbody>
                {items.map((item, i) => (
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

            {/* Amount Due */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-gray-700">
                Amount Due
              </span>

              <span className="text-xl font-bold" style={{ color: accent.bg }}>
                ₦{Number(total).toLocaleString()}
              </span>
            </div>

            {/* Notes */}
            {notes && (
              <p className="text-xs text-gray-500 mt-4 border-t border-gray-100 pt-3">
                {notes}
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

        {/* Actions */}
        <div className="print:hidden flex flex-col gap-2 mt-6">
          {/* Back to Invoices */}
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => navigate("/invoices")}
          >
            ← Back to Invoices
          </Button>

          {/* Share Invoice Image */}
          <Button className="w-full" onClick={handleShare} disabled={sharing}>
            {sharing ? "Preparing Invoice..." : "Share Invoice"}
          </Button>

          {/* Print / Save as PDF */}
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

export default InvoiceDetail;
