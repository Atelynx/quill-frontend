import { Link } from 'react-router-dom'


export default function PagesBar() {

  return (
    <nav className="w-full pages-bar bg-primary p-2 flex flex-row gap-2 text-sm font-bold text-accent">
      <Link to="/"
        className="block bg-secondary rounded px-2 py-1 hover:text-text">
        Home
      </Link>
      <Link to="/test"
        className="block bg-secondary rounded px-2 py-1 hover:text-text">
        Test
      </Link>
      <Link to="/auth"
        className="block bg-secondary rounded px-2 py-1 hover:text-text">
        Quill Login (Actual Project)
      </Link>
    </nav>
  );
};