// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext.jsx";
// import api from "../services/api.js";
// import StatCard from "../components/dashboard/StatCard.jsx";
// import Button from "../components/common/Button.jsx";
// import Loader from "../components/common/Loader.jsx";
// import { useNavigate, Link } from "react-router-dom";

// const isSameDay = (a, b) =>
//   a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// const Dashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [business, setBusiness] = useState(null);
//   const [sales, setSales] = useState([]);
//   const [lowStockProducts, setLowStockProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [businessRes, salesRes, productsRes] = await Promise.allSettled([
//           api.get("/business"),
//           api.get("/sales"),
//           api.get("/products"),
//         ]);
//         let threshold = 5;
//         if (businessRes.status === "fulfilled") {
//           setBusiness(businessRes.value.data.business);
//           threshold = businessRes.value.data.business.lowStockThreshold ?? 5;
//         }
//         if (salesRes.status === "fulfilled") setSales(salesRes.value.data.sales);
//         if (productsRes.status === "fulfilled") {
//           setLowStockProducts(productsRes.value.data.products.filter((p) => p.quantity <= threshold));
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const today = new Date();
//   const todaysSales = sales.filter((s) => isSameDay(new Date(s.createdAt), today));
//   const todaysTotal = todaysSales.reduce((sum, s) => sum + s.total, 0);
//   const monthlyTotal = sales
//     .filter((s) => new Date(s.createdAt).getMonth() === today.getMonth() && new Date(s.createdAt).getFullYear() === today.getFullYear())
//     .reduce((sum, s) => sum + s.total, 0);

//   if (loading) {
//     return <Loader label="Loading your dashboard..." />;
//   }

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         {business ? (
//           <>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{business.name}</h1>
//             <p className="text-sm text-gray-500 mt-1">
//               {business.category && <span>{business.category}</span>}
//               {business.city && <span> · {business.city}{business.state ? `, ${business.state}` : ""}</span>}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">
//               Signed in as {user?.name} ({user?.email})
//             </p>
//           </>
//         ) : (
//           <>
//             <h1 className="text-xl font-semibold">Welcome, {user?.name}</h1>
//             <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
//           </>
//         )}
//       </div>

//       {!business && (
//         <div className="mb-6 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//           <span>You haven't set up your business yet.</span>
//           <Button variant="secondary" onClick={() => navigate("/onboarding")}>
//             Finish setup
//           </Button>
//         </div>
//       )}

//       {lowStockProducts.length > 0 && (
//         <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//           <span>
//             <strong>{lowStockProducts.length}</strong> product{lowStockProducts.length !== 1 ? "s" : ""} running low:{" "}
//             {lowStockProducts.map((p) => p.name).join(", ")}
//           </span>
//           <Link to="/products" className="text-danger underline font-medium whitespace-nowrap ml-3">
//             Restock
//           </Link>
//         </div>
//       )}

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard label="Today's Sales" value={`₦${todaysTotal.toLocaleString()}`} />
//         <StatCard label="Today's Transactions" value={todaysSales.length} />
//         <StatCard label="Monthly Sales" value={`₦${monthlyTotal.toLocaleString()}`} />
//         <StatCard label="Outstanding Invoices" value="0" />
//       </div>

//       <div className="flex items-center justify-between mt-8 mb-3">
//         <h2 className="text-sm font-semibold text-gray-700">Recent Sales</h2>
//         <Link to="/sales" className="text-sm text-brand hover:underline">
//           View all
//         </Link>
//       </div>

//       {sales.length === 0 ? (
//         <p className="text-gray-400 text-sm">
//           No sales yet. <Link to="/sales/new" className="text-brand hover:underline">Record your first sale</Link>.
//         </p>
//       ) : (
//         <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//           {sales.slice(0, 5).map((s) => (
//             <div key={s._id} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 text-sm">
//               <span>{s.customerName} · {s.items.length} item{s.items.length !== 1 ? "s" : ""}</span>
//               <span className="font-medium">₦{Number(s.total).toLocaleString()}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import StatCard from "../components/dashboard/StatCard.jsx";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";
import { useNavigate, Link } from "react-router-dom";

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [sales, setSales] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [businessRes, salesRes, productsRes] = await Promise.allSettled([
          api.get("/business"),
          api.get("/sales"),
          api.get("/products"),
        ]);

        let threshold = 5;

        if (businessRes.status === "fulfilled") {
          setBusiness(businessRes.value.data.business);
          threshold = businessRes.value.data.business.lowStockThreshold ?? 5;
        }

        if (salesRes.status === "fulfilled") {
          setSales(salesRes.value.data.sales);
        }

        if (productsRes.status === "fulfilled") {
          setLowStockProducts(
            productsRes.value.data.products.filter(
              (p) => p.quantity <= threshold,
            ),
          );
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const today = new Date();

  const todaysSales = sales.filter((s) =>
    isSameDay(new Date(s.createdAt), today),
  );

  const todaysTotal = todaysSales.reduce((sum, s) => sum + s.total, 0);

  const monthlyTotal = sales
    .filter(
      (s) =>
        new Date(s.createdAt).getMonth() === today.getMonth() &&
        new Date(s.createdAt).getFullYear() === today.getFullYear(),
    )
    .reduce((sum, s) => sum + s.total, 0);

  if (loading) {
    return <Loader label="Loading your dashboard..." />;
  }

  return (
    <div className="p-6">
      {/* Business Header */}
      <div className="mb-6">
        {business ? (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {business.name}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {business.category && <span>{business.category}</span>}

              {business.city && (
                <span>
                  {" "}
                  · {business.city}
                  {business.state ? `, ${business.state}` : ""}
                </span>
              )}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Signed in as {user?.name} ({user?.email})
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">Welcome, {user?.name}</h1>

            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </>
        )}
      </div>

      {/* Business Setup Warning */}
      {!business && (
        <div className="mb-6 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>You haven't set up your business yet.</span>

          <Button variant="secondary" onClick={() => navigate("/onboarding")}>
            Finish setup
          </Button>
        </div>
      )}

      {/* Low Stock Warning */}
      {lowStockProducts.length > 0 && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-danger text-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>
            <strong>{lowStockProducts.length}</strong> product
            {lowStockProducts.length !== 1 ? "s" : ""} running low:{" "}
            {lowStockProducts.map((p) => p.name).join(", ")}
          </span>

          <Link
            to="/products"
            className="text-danger underline font-medium whitespace-nowrap ml-3"
          >
            Restock
          </Link>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Today's Sales"
          value={`₦${todaysTotal.toLocaleString()}`}
        />

        <StatCard label="Today's Transactions" value={todaysSales.length} />

        <StatCard
          label="Monthly Sales"
          value={`₦${monthlyTotal.toLocaleString()}`}
        />

        <StatCard label="Outstanding Invoices" value="0" />
      </div>

      {/* Storefront Promotion */}
      <div className="mt-8 mb-8 rounded-xl border border-blue-100 bg-blue-50 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏪</span>

              <h2 className="text-lg font-semibold text-gray-900">
                Give your business a storefront
              </h2>
            </div>

            <p className="text-sm text-gray-600 max-w-xl">
              Showcase your products online with your own shareable storefront.
              Customers can browse your products and contact you directly to
              place orders.
            </p>
          </div>

          <Button onClick={() => navigate("/storefront")}>
            Create Storefront
          </Button>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="flex items-center justify-between mt-8 mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Recent Sales</h2>

        <Link to="/sales" className="text-sm text-brand hover:underline">
          View all
        </Link>
      </div>

      {sales.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No sales yet.{" "}
          <Link to="/sales/new" className="text-brand hover:underline">
            Record your first sale
          </Link>
          .
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {sales.slice(0, 5).map((s) => (
            <div
              key={s._id}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 text-sm"
            >
              <span>
                {s.customerName} · {s.items.length} item
                {s.items.length !== 1 ? "s" : ""}
              </span>

              <span className="font-medium">
                ₦{Number(s.total).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
