import { useState } from "react";
import { uploadImage } from "../../utils/uploadImage.js";

// A single reusable image-upload field: pick a file, it uploads to Cloudinary,
// and the resulting URL is passed back via onChange. Used for business logos
// and product photos alike.
const ImageUpload = ({ label, value, onChange, shape = "square" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message || "Could not upload image");
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-selecting the same file later
    }
  };

  const previewShape = shape === "round" ? "rounded-full" : "rounded-md";

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="Preview" className={`h-16 w-16 object-cover border border-gray-200 ${previewShape}`} />
        ) : (
          <div className={`h-16 w-16 flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 text-gray-300 text-xs ${previewShape}`}>
            No image
          </div>
        )}

        <div className="flex flex-col gap-1">
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" disabled={uploading} />
          {uploading && <p className="text-xs text-gray-400">Uploading...</p>}
          {value && !uploading && (
            <button type="button" onClick={() => onChange("")} className="text-xs text-danger hover:underline self-start">
              Remove image
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};

export default ImageUpload;
