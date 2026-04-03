import { Link } from 'react-router-dom'

export default function PagesBar() {

  return (
    <nav className="w-full pages-bar bg-blue-900/30 p-2 flex flex-row gap-2 text-sm text-white/70">
      <Link to="/"
        className="block bg-slate-950 rounded px-2 py-1 hover:text-white">
        Home
      </Link>
      <Link to="/test"
        className="block bg-slate-950 rounded px-2 py-1 hover:text-white">
        Test
      </Link>
    </nav>
  );
};