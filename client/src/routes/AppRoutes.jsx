import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

import Landing from "../pages/Landing.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Onboarding from "../pages/Onboarding.jsx";
import PublicReceipt from "../pages/PublicReceipt.jsx";

import Dashboard from "../pages/Dashboard.jsx";
import Products from "../pages/Products.jsx";
import ProductForm from "../pages/ProductForm.jsx";
import Customers from "../pages/Customers.jsx";
import CustomerDetail from "../pages/CustomerDetail.jsx";
import Sales from "../pages/Sales.jsx";
import NewSale from "../pages/NewSale.jsx";
import SaleDetail from "../pages/SaleDetail.jsx";
import Receipts from "../pages/Receipts.jsx";
import ReceiptDetail from "../pages/ReceiptDetail.jsx";
import Invoices from "../pages/Invoices.jsx";
import InvoiceForm from "../pages/InvoiceForm.jsx";
import InvoiceDetail from "../pages/InvoiceDetail.jsx";
import Settings from "../pages/Settings.jsx";
import SettingsBusiness from "../pages/SettingsBusiness.jsx";
import SettingsReceipts from "../pages/SettingsReceipts.jsx";
import SettingsAccount from "../pages/SettingsAccount.jsx";
import Storefront from "../pages/Storefront.jsx";
import PublicStorefront from "../pages/PublicStorefront.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/receipt/:token" element={<PublicReceipt />} />
      <Route path="/invoice/:token" element={<InvoiceDetail />} />
      <Route path="/store/:slug" element={<PublicStorefront />} />

      {/* Authenticated, but no sidebar yet — business isn't set up */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Authenticated app shell */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />

        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />

        <Route path="/sales" element={<Sales />} />
        <Route path="/sales/new" element={<NewSale />} />
        <Route path="/sales/:id" element={<SaleDetail />} />

        <Route path="/receipts" element={<Receipts />} />
        <Route path="/receipts/:id" element={<ReceiptDetail />} />

        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/new" element={<InvoiceForm />} />

        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/business" element={<SettingsBusiness />} />
        <Route path="/settings/receipts" element={<SettingsReceipts />} />
        <Route path="/settings/account" element={<SettingsAccount />} />

        <Route path="/storefront" element={<Storefront />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
