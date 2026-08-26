import { Link } from "react-router-dom";

const settingsLinks = [
  {
    to: "/settings/business",
    title: "Business Details",
    description: "Name, category, contact info, and address — shown on your receipts and invoices.",
  },
  {
    to: "/settings/receipts",
    title: "Receipt Branding",
    description: "Customize the footer message shown on your shared receipts and invoices.",
  },
  {
    to: "/settings/account",
    title: "Account",
    description: "Update your name and phone number, or change your password.",
  },
];

const Settings = () => {
  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold mb-6">Settings</h1>
      <div className="flex flex-col gap-3">
        {settingsLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-brand transition-colors"
          >
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Settings;
