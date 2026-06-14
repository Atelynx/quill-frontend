import { NavLink } from 'react-router-dom';
import { admin } from '../../../shared/content/strings';

export function AdminNav() {
  return (
    <nav className="mb-6 flex gap-1 rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] bg-[var(--main-page-surface-muted)] p-1">
      <NavLink
        to="/admin/config"
        end
        className={({ isActive }) =>
          `flex-1 rounded-[calc(var(--main-page-radius-md)-4px)] px-4 py-2.5 text-center text-[0.92rem] font-medium transition-colors ${
            isActive
              ? 'bg-[var(--gradient-tab-active)] text-white shadow-sm'
              : 'text-[var(--main-page-text-soft)] hover:text-[var(--color-text)]'
          }`
        }
      >
        {admin.config.title}
      </NavLink>
      <NavLink
        to="/admin/snapshots"
        className={({ isActive }) =>
          `flex-1 rounded-[calc(var(--main-page-radius-md)-4px)] px-4 py-2.5 text-center text-[0.92rem] font-medium transition-colors ${
            isActive
              ? 'bg-[var(--gradient-tab-active)] text-white shadow-sm'
              : 'text-[var(--main-page-text-soft)] hover:text-[var(--color-text)]'
          }`
        }
      >
        {admin.snapshots.title}
      </NavLink>
      <NavLink
        to="/admin/stocks"
        className={({ isActive }) =>
          `flex-1 rounded-[calc(var(--main-page-radius-md)-4px)] px-4 py-2.5 text-center text-[0.92rem] font-medium transition-colors ${
            isActive
              ? 'bg-[var(--gradient-tab-active)] text-white shadow-sm'
              : 'text-[var(--main-page-text-soft)] hover:text-[var(--color-text)]'
          }`
        }
      >
        {admin.stocks.title}
      </NavLink>
    </nav>
  );
}
