import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";
import landingBg from "../assets/images/landingbg.jpg";

const Landing = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${landingBg})` }}
    >
      <div className="min-h-screen flex items-center">
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-12">
          <div className="max-w-xl text-left">
            {/* Brand */}
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-blue-600 mb-4">
              SELLZA
            </h2>

            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-gray-900">
              Professional receipts.
              <br />
              Simple sales tracking.
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 max-w-md mb-8">
              Record sales and generate professional digital invoices and
              receipts for your business.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>

              <Link to="/login">
                <Button variant="secondary">Log in</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
