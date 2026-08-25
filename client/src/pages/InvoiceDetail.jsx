// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../services/api.js";
// import Loader from "../components/common/Loader.jsx";
// import Button from "../components/common/Button.jsx";

// // Same fixed brand accent as receipts, for consistent branding across the app.
// const INVOICE_ACCENT = { bg: "#2563EB" };

// const InvoiceDetail = () => {
//   const { token } = useParams();
//   const [data, setData] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [shareSupported, setShareSupported] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     setShareSupported(Boolean(navigator.share));
//   }, []);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const { data } = await api.get(`/invoices/public/${token}`);
//         setData(data.invoice);
//       } catch (err) {
//         setError(err.response?.data?.message || "This invoice could not be found");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [token]);

//   const handleShare = async () => {
//     try {
//       await navigator.share({
//         title: data ? `Invoice from ${data.business.name}` : "Invoice",
//         text: data ? `Invoice from ${data.business.name}. Amount due: ₦${Number(data.total).toLocaleString()}` : "",
//         url: window.location.href,
//       });
//     } catch (err) {
//       // cancelled — fine
//     }
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(window.location.href);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (loading) return <Loader label="Loading invoice..." />;
//   if (error) {
//     return <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm p-6">{error}</div>;
//   }

//   const { business, customerName, items, total, dueDate, status, isOverdue, notes, createdAt } = data;
//   const accent = INVOICE_ACCENT;

//   const statusLabel = status === "paid" ? "Paid" : isOverdue ? "Overdue" : "Unpaid";
//   const statusColor = status === "paid" ? "#16A34A" : isOverdue ? "#DC2626" : "#d97706";

//   return (
//     <div className="min-h-screen bg-gray-200 py-10 px-4 print:bg-white print:py-0 flex justify-center">
//       <div className="w-full max-w-sm">
//         <div className="bg-white rounded-xl shadow-lg print:shadow-none overflow-hidden">
//           <div className="px-6 pt-6 pb-8 text-white" style={{ backgroundColor: accent.bg }}>
//             <div className="flex items-center justify-between mb-4">
//               <h1 className="text-lg font-bold">{business.name}</h1>
//               <span
//                 className="text-xs font-semibold px-2 py-1 rounded-full bg-white"
//                 style={{ color: statusColor }}
//               >
//                 {statusLabel}
//               </span>
//             </div>
//             {business.address && <p className="text-xs text-white/80">{business.address}</p>}
//             {business.phone && <p className="text-xs text-white/80">{business.phone}</p>}
//           </div>

//           <div className="px-6 pt-5 pb-6 -mt-4 bg-white rounded-t-2xl">
//             <div className="flex justify-between text-xs text-gray-500 mb-1">
//               <span>Invoice date</span>
//               <span>{new Date(createdAt).toLocaleDateString()}</span>
//             </div>
//             <div className="flex justify-between text-xs text-gray-500 mb-4">
//               <span>Due date</span>
//               <span className={isOverdue ? "text-danger font-medium" : ""}>
//                 {new Date(dueDate).toLocaleDateString()}
//               </span>
//             </div>

//             <div className="text-xs text-gray-500 mb-3">
//               Billed to <span className="font-medium text-gray-700">{customerName}</span>
//             </div>

//             <div className="border-t border-dashed border-gray-300 my-3" />

//             <table className="w-full text-sm font-mono">
//               <tbody>
//                 {items.map((item, i) => (
//                   <tr key={i} className="align-top">
//                     <td className="py-1.5 pr-2">
//                       <div className="text-gray-800">{item.name}</div>
//                       <div className="text-[11px] text-gray-400">
//                         {item.quantity} × ₦{Number(item.price).toLocaleString()}
//                       </div>
//                     </td>
//                     <td className="py-1.5 text-right align-top text-gray-800 whitespace-nowrap">
//                       ₦{Number(item.subtotal).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="border-t border-dashed border-gray-300 my-3" />

//             <div className="flex justify-between items-baseline">
//               <span className="text-sm font-semibold text-gray-700">Amount Due</span>
//               <span className="text-xl font-bold" style={{ color: accent.bg }}>
//                 ₦{Number(total).toLocaleString()}
//               </span>
//             </div>

//             {notes && <p className="text-xs text-gray-500 mt-4 border-t border-gray-100 pt-3">{notes}</p>}

//             <p className="text-center text-[10px] text-gray-300 mt-6 tracking-wide">Powered by Invoice SaaS</p>
//           </div>
//         </div>

//         <div className="print:hidden flex flex-col gap-2 mt-6">
//           {shareSupported && (
//             <Button className="w-full" onClick={handleShare}>
//               Share Invoice
//             </Button>
//           )}
//           <Button className="w-full" variant="secondary" onClick={() => window.print()}>
//             Print / Save as PDF
//           </Button>
//           {!shareSupported && (
//             <button onClick={handleCopyLink} className="text-sm text-brand hover:underline mt-1 text-center">
//               {copied ? "Link copied!" : "Copy invoice link instead"}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceDetail;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import Loader from "../components/common/Loader.jsx";
import Button from "../components/common/Button.jsx";

// Same fixed brand accent as receipts, for consistent branding across the app.
const INVOICE_ACCENT = { bg: "#2563EB" };

const InvoiceDetail = () => {
  const { token } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [shareSupported, setShareSupported] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareSupported(Boolean(navigator.share));
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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: data ? `Invoice from ${data.business.name}` : "Invoice",
        text: data
          ? `Invoice from ${data.business.name}. Amount due: ₦${Number(
              data.total,
            ).toLocaleString()}`
          : "",
        url: window.location.href,
      });
    } catch (err) {
      // Cancelled — fine
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
        {/* Invoice */}
        <div className="bg-white rounded-xl shadow-lg print:shadow-none overflow-hidden">
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
          {shareSupported && (
            <Button className="w-full" onClick={handleShare}>
              Share Invoice
            </Button>
          )}

          <Button
            className="w-full"
            variant="secondary"
            onClick={() => window.print()}
          >
            Print / Save as PDF
          </Button>

          {!shareSupported && (
            <button
              onClick={handleCopyLink}
              className="text-sm text-brand hover:underline mt-1 text-center"
            >
              {copied ? "Link copied!" : "Copy invoice link instead"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
