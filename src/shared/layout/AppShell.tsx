import { useState, useEffect, type PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../app/auth/hooks/use-auth';
import { ThemeToggle, CurrencySelector } from '../components';
import { appShell, labels, admin } from '../content/strings';
import { button, surface, gradient } from '../design-system/surfaces';
import { eyebrow, sidebarLabel } from '../design-system/typography';

interface AppShellProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="grid min-h-screen grid-cols-[minmax(240px,280px)_1fr] max-[1180px]:grid-cols-1">
      <aside className={`${gradient.sidebar} sticky top-0 flex h-screen flex-col gap-4 overflow-y-auto p-6 text-white max-[1180px]:static max-[1180px]:h-auto max-[1180px]:order-2 max-[720px]:fixed max-[720px]:inset-y-0 max-[720px]:left-0 max-[720px]:z-50 max-[720px]:w-[280px] max-[720px]:p-4 max-[720px]:shadow-2xl max-[720px]:transition-transform max-[720px]:duration-300 ${sidebarOpen ? 'max-[720px]:translate-x-0' : 'max-[720px]:-translate-x-full'}`}>
        <button
          type="button"
          onClick={closeSidebar}
          className="hidden self-end rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white max-[720px]:flex"
          aria-label="Cerrar menu de navegacion"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div>
          <p className={eyebrow}>{appShell.brandEyebrow}</p>
          <h2 className="mb-2 mt-[0.2rem] text-[2rem]">{appShell.brandTitle}</h2>
          <p className="text-[var(--main-page-inverse-text-soft)]">
            {appShell.brandDescription}
          </p>
        </div>

        <div className={`${surface.inverseCard} grid gap-[0.2rem] p-4 text-white`}>
          <span className={sidebarLabel}>{appShell.account}</span>
          <strong className="block">{user?.fullName}</strong>
          <small className="block text-[var(--main-page-inverse-text-soft)]">{user?.email}</small>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `rounded-[var(--main-page-radius-md)] px-4 py-2.5 text-white transition-colors ${
                isActive
                  ? 'bg-white/10 font-semibold'
                  : 'text-[var(--main-page-inverse-text-soft)] hover:bg-white/5'
              }`
            }
          >
            {appShell.nav.dashboard}
          </NavLink>
          <NavLink
            to="/watchlist"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `rounded-[var(--main-page-radius-md)] px-4 py-2.5 text-white transition-colors ${
                isActive
                  ? 'bg-white/10 font-semibold'
                  : 'text-[var(--main-page-inverse-text-soft)] hover:bg-white/5'
              }`
            }
          >
            {appShell.nav.watchlist}
          </NavLink>
          <NavLink
            to="/friends"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `rounded-[var(--main-page-radius-md)] px-4 py-2.5 text-white transition-colors ${
                isActive
                  ? 'bg-white/10 font-semibold'
                  : 'text-[var(--main-page-inverse-text-soft)] hover:bg-white/5'
              }`
            }
          >
            {appShell.nav.friends}
          </NavLink>
          <NavLink
            to="/settings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `rounded-[var(--main-page-radius-md)] px-4 py-2.5 text-white transition-colors ${
                isActive
                  ? 'bg-white/10 font-semibold'
                  : 'text-[var(--main-page-inverse-text-soft)] hover:bg-white/5'
              }`
            }
          >
            {appShell.nav.settings}
          </NavLink>

          {user?.role === 'admin' ? (
            <NavLink
              to="/admin/config"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `rounded-[var(--main-page-radius-md)] px-4 py-2.5 text-white transition-colors ${
                  isActive
                    ? 'bg-white/10 font-semibold'
                    : 'text-[var(--main-page-inverse-text-soft)] hover:bg-white/5'
                }`
              }
            >
              {admin.nav}
            </NavLink>
          ) : null}
        </nav>

        <div className={`${surface.inverseCard} p-4 text-white`}>
          <span className={sidebarLabel}>{appShell.focus.title}</span>
          <ul className="m-0 grid gap-[0.55rem] pl-4 text-[var(--main-page-inverse-text-soft)]">
            {appShell.focus.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="p-6 max-[720px]:p-4">
        <header className="mb-5 flex items-start justify-between gap-4 max-[820px]:flex-col max-[820px]:items-stretch">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className={`${button.themeToggle} hidden max-[720px]:flex`}
              aria-label="Abrir menu de navegacion"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>

            <div>
              <p className={eyebrow}>{appShell.header.eyebrow}</p>
              <h1 className="m-0">{title}</h1>
              <p className="max-w-[68ch]">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 max-[820px]:w-full max-[820px]:justify-between">
            <ThemeToggle />
            <CurrencySelector />
            <button className={`${button.base} ${button.secondary}`} onClick={logout} type="button">
              {labels.action.logout}
            </button>
          </div>
        </header>

        <div className="grid gap-[1.2rem]">{children}</div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 hidden bg-black/50 transition-opacity max-[720px]:block"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
