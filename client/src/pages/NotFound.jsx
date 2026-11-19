import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-lg text-center">
        {/* SELLZA Logo */}
        <Link to="/" className="mb-12 inline-block">
          <span className="text-3xl font-extrabold tracking-tight text-brand">
            SELLZA
          </span>
        </Link>

        {/* Error Code */}
        <h1 className="mb-4 text-8xl font-extrabold tracking-tight text-brand sm:text-9xl">
          404
        </h1>

        <h2 className="mb-3 text-2xl font-bold text-ink sm:text-3xl">
          Page not found
        </h2>

        <p className="mx-auto mb-9 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
          Sorry, we couldn't find the page you're looking for. It may have been
          moved, deleted, or the link may be incorrect.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Back to homepage
        </Link>

        <p className="mt-16 text-xs text-slate-400">
          © {new Date().getFullYear()} SELLZA. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
