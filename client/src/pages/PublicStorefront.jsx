import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import Loader from "../components/common/Loader.jsx";

// Change this path to wherever you place your storefront background image
import storefrontBackground from "../assets/images/storefront.png";

const PublicStorefront = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/storefront/${slug}`);
        setData(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "This storefront could not be found",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (loading) return <Loader label="Loading storefront..." />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm p-6 text-center">
        {error}
      </div>
    );
  }

  const { business, products } = data;

  const contactHref = business.phone
    ? `https://wa.me/${business.phone.replace(/[^0-9]/g, "")}`
    : business.email
      ? `mailto:${business.email}`
      : null;

  return (
    <div className="min-h-screen bg-[#b8babb]">
      {/* Storefront Hero */}
      <div
        className="relative bg-cover bg-center bg-no-repeat text-white px-6 py-12 text-center overflow-hidden"
        style={{
          backgroundImage: `url(${storefrontBackground})`,
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Hero content */}
        <div className="relative z-10">
          {business.logo ? (
            <img
              src={business.logo}
              alt={business.name}
              className="h-20 w-20 rounded-full object-cover mx-auto mb-3 border-4 border-white/30"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 text-3xl font-bold">
              {business.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}

          <h1 className="text-2xl font-bold">{business.name}</h1>

          {business.slogan && (
            <p className="text-white/90 text-sm font-medium mt-1">
              {business.slogan}
            </p>
          )}

          {business.description && (
            <p className="text-white/75 text-sm mt-3 max-w-md mx-auto">
              {business.description}
            </p>
          )}

          {(business.city || business.state) && (
            <p className="text-white/60 text-xs mt-3">
              {business.city}
              {business.city && business.state ? ", " : ""}
              {business.state}
            </p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">
            No products listed yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "No image"
                  )}
                </div>

                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {p.name}
                  </p>

                  <p className="text-sm text-brand font-semibold mt-1">
                    ₦{Number(p.price).toLocaleString()}
                  </p>

                  {p.quantity < 1 && (
                    <p className="text-xs text-danger mt-1">Out of stock</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Button */}
      {contactHref && (
        <a
          href={contactHref}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 right-5 bg-success text-white rounded-full px-5 py-3 shadow-lg text-sm font-medium hover:opacity-90"
        >
          Contact to Order
        </a>
      )}
    </div>
  );
};

export default PublicStorefront;
