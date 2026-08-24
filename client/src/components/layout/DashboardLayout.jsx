import { Link, Outlet } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/sales/new", label: "New Sale" },
  { to: "/products", label: "Products" },
  { to: "/customers", label: "Customers" },
  { to: "/receipts", label: "Receipts" },
  { to: "/invoices", label: "Invoices" },
  { to: "/settings", label: "Settings" },
];

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4">
        <div className="font-bold text-lg mb-6">Invoice SaaS</div>
        <nav className="flex md:flex-col gap-2 flex-wrap">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-gray-700 hover:text-black hover:bg-gray-100 rounded px-3 py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
