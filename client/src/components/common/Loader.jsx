const Loader = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-2 py-8 text-gray-500 text-sm">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand" />
    {label}
  </div>
);

export default Loader;
