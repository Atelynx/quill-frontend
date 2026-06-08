import { Link } from 'react-router-dom';
import { labels, notFound } from '../../shared/content/strings';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-text/14 bg-background p-10 text-center shadow-sm">
      <h1 className="text-3xl font-bold text-text">{notFound.title}</h1>
      <p className="mt-3 text-sm text-text/72">
        {notFound.description}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/avance"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
        >
          {labels.action.goToDashboard}
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-text/14 px-4 py-2 text-sm font-semibold text-text hover:bg-text/8"
        >
          {labels.action.backToLogin}
        </Link>
      </div>
    </div>
  );
}

