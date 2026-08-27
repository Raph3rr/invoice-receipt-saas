import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/sales/new", label: "New Sale" },
  { to: "/products", label: "Products" },
  { to: "/customers", label: "Customers" },
  { to: "/receipts", label: "Receipts" },
  { to: "/invoices", label: "Invoices" },
  { to: "/storefront", label: "Storefront" },
  { to: "/settings", label: "Settings" },
];

const HamburgerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    closeSidebar();
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full overflow-x-hidden">
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-20">
        <span className="font-extrabold text-xl tracking-tight text-brand">
          SELLZA
        </span>

        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-md flex-shrink-0"
        >
          <HamburgerIcon />
        </button>
      </header>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 md:w-56 bg-white border-r border-gray-200 p-4 z-40
          flex flex-col
          transform transition-transform duration-200 ease-in-out md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="block font-extrabold text-2xl tracking-tight text-brand">
              SELLZA
            </span>

            <span className="block text-[11px] text-gray-400 mt-0.5">
              Sell smarter. Track everything.
            </span>
          </div>

          <button
            onClick={closeSidebar}
            aria-label="Close menu"
            className="md:hidden p-1 text-gray-500 hover:text-gray-800"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={`text-sm rounded-md px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-brand-light text-brand-dark font-medium"
                    : "text-gray-700 hover:text-black hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          {user && (
            <p className="text-xs text-gray-400 truncate mb-2 px-3">
              {user.email}
            </p>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-left text-sm rounded-md px-3 py-2 text-danger hover:bg-red-50 transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
