import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-3xl font-bold mb-2">Professional receipts. Simple sales tracking.</h1>
      <p className="text-gray-500 max-w-md mb-8">
        Record sales and generate professional digital invoices and receipts for your business.
      </p>
      <div className="flex gap-3">
        <Link to="/register">
          <Button>Get Started</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary">Log in</Button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
