import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../app/auth/hooks/use-auth';
import { ThemeToggle, CurrencySelector } from '../components';
import { button, surface, gradient } from '../design-system/surfaces';
import { eyebrow, sidebarLabel } from '../design-system/typography';

interface AppShellProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const { user, logout } = useAuth();

  return (
    <div className="grid min-h-screen grid-cols-[minmax(240px,280px)_1fr] max-[1180px]:grid-cols-1">
      <aside className={`${gradient.sidebar} flex flex-col gap-4 p-6 text-white max-[1180px]:order-2 max-[720px]:p-4`}>
        <div>
          <p className={eyebrow}>Atelynx</p>
          <h2 className="mb-2 mt-[0.2rem] text-[2rem]">Quill</h2>
          <p className="text-[var(--main-page-inverse-text-soft)]">
            Simulador educativo de inversion para practicar decisiónes con datos
            dinamicos, comisiones y ordenes limite.
          </p>
        </div>

        <div className={`${surface.inverseCard} grid gap-[0.2rem] p-4 text-white`}>
          <span className={sidebarLabel}>Cuenta activa</span>
          <strong className="block">{user?.fullName}</strong>
          <small className="block text-[var(--main-page-inverse-text-soft)]">{user?.email}</small>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `rounded-[var(--main-page-radius-md)] px-4 py-2.5 text-white transition-colors ${
                isActive
                  ? 'bg-white/10 font-semibold'
                  : 'text-[var(--main-page-inverse-text-soft)] hover:bg-white/5'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              `rounded-[var(--main-page-radius-md)] px-4 py-2.5 text-white transition-colors ${
                isActive
                  ? 'bg-white/10 font-semibold'
                  : 'text-[var(--main-page-inverse-text-soft)] hover:bg-white/5'
              }`
            }
          >
            Seguimiento
          </NavLink>
          <NavLink
            to="/friends"
            className={({ isActive }) =>
              `rounded-[var(--main-page-radius-md)] px-4 py-2.5 text-white transition-colors ${
                isActive
                  ? 'bg-white/10 font-semibold'
                  : 'text-[var(--main-page-inverse-text-soft)] hover:bg-white/5'
              }`
            }
          >
            Amigos
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `rounded-[var(--main-page-radius-md)] px-4 py-2.5 text-white transition-colors ${
                isActive
                  ? 'bg-white/10 font-semibold'
                  : 'text-[var(--main-page-inverse-text-soft)] hover:bg-white/5'
              }`
            }
          >
            Configuracion
          </NavLink>
        </nav>

        <div className={`${surface.inverseCard} p-4 text-white`}>
          <span className={sidebarLabel}>Enfoque de Quill</span>
          <ul className="m-0 grid gap-[0.55rem] pl-4 text-[var(--main-page-inverse-text-soft)]">
            <li>Practica sin riesgo financiero real.</li>
            <li>Observa como se ejecuta una orden limite.</li>
            <li>Aprende leyendo tu portafolio y tus operaciones.</li>
          </ul>
        </div>
      </aside>

      <div className="p-6 max-[720px]:p-4">
        <header className="mb-5 flex items-start justify-between gap-4 max-[820px]:flex-col max-[820px]:items-stretch">
          <div>
            <p className={eyebrow}>Plataforma Quill</p>
            <h1 className="m-0">{title}</h1>
            <p className="max-w-[68ch]">{subtitle}</p>
          </div>

          <div className="flex items-center gap-3 max-[820px]:w-full max-[820px]:justify-between">
            <ThemeToggle />
            <CurrencySelector />
            <button className={`${button.base} ${button.secondary}`} onClick={logout} type="button">
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="grid gap-[1.2rem]">{children}</div>
      </div>
    </div>
  );
}
