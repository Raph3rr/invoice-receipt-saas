import { useEffect, useState } from "react";
import api from "../services/api.js";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";

const Storefront = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/business");
      setBusiness(data.business);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load business");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const { data } = await api.put("/business", { storefrontEnabled: !business.storefrontEnabled });
      setBusiness(data.business);
    } catch (err) {
      alert(err.response?.data?.message || "Could not update storefront");
    } finally {
      setToggling(false);
    }
  };

  const storeUrl = business ? `${window.location.origin}/store/${business.slug}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <Loader label="Loading storefront..." />;
  if (error) return <div className="p-6 text-danger text-sm">{error}</div>;

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold mb-1">Storefront</h1>
      <p className="text-sm text-gray-500 mb-6">
        A public page where customers can browse your products and contact you directly to order — no login needed
        on their end.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">
              Storefront is {business.storefrontEnabled ? "live" : "off"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {business.storefrontEnabled
                ? "Anyone with your link can view your products."
                : "Turn this on to make your storefront publicly visible."}
            </p>
          </div>
          <Button variant={business.storefrontEnabled ? "secondary" : "primary"} onClick={handleToggle} disabled={toggling}>
            {toggling ? "Saving..." : business.storefrontEnabled ? "Turn off" : "Turn on"}
          </Button>
        </div>
      </div>

      {business.storefrontEnabled && (
        <div className="bg-brand-light border border-brand/30 rounded-md p-4">
          <p className="text-sm text-brand-navy mb-2">Your storefront link:</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={storeUrl}
              className="flex-1 text-sm bg-white border border-brand/30 rounded px-2 py-1.5 text-gray-600"
              onFocus={(e) => e.target.select()}
            />
            <Button type="button" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <a href={storeUrl} target="_blank" rel="noreferrer" className="text-sm text-brand-dark hover:underline mt-2 inline-block">
            Open storefront →
          </a>
        </div>
      )}
    </div>
  );
};

export default Storefront;
