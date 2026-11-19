const Maintenance = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-lg text-center">
        {/* SELLZA Logo */}
        <div className="mb-12">
          <span className="text-3xl font-extrabold tracking-tight text-brand">
            SELLZA
          </span>
        </div>

        {/* Maintenance Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-blue-100 bg-brand-light">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2563EB"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.9 7.9l-6.8 6.8a2.1 2.1 0 0 1-3-3l6.8-6.8a6 6 0 0 1 7.9-7.9z" />
          </svg>
        </div>

        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-brand">
          Under maintenance
        </p>

        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          We'll be back shortly.
        </h1>

        <p className="mx-auto max-w-md text-sm leading-7 text-slate-500 sm:text-base">
          SELLZA is currently undergoing scheduled maintenance as we work to
          improve your experience. We're making a few improvements behind the
          scenes. Thank you for your patience.
        </p>

        {/* Status */}
        <div className="mx-auto mt-9 inline-flex items-center gap-3 rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand" />
          <span className="text-xs font-medium text-slate-600">
            Improvements in progress
          </span>
        </div>

        <p className="mt-16 text-xs text-slate-400">
          © {new Date().getFullYear()} SELLZA. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
