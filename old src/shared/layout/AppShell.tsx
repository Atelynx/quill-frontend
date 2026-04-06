import type { PropsWithChildren } from 'react';
import { useAuth } from '../../modules/auth/hooks/use-auth';
import { ThemeToggle } from '../components/ThemeToggle';

interface AppShellProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-block">
          <p className="eyebrow">Atelynx</p>
          <h2>Quill</h2>
          <p className="sidebar-copy">
            Simulador educativo de inversion para practicar decisiones con datos
            dinamicos, comisiones y ordenes limite.
          </p>
        </div>

        <div className="sidebar-card">
          <span className="sidebar-card__label">Cuenta activa</span>
          <strong>{user?.fullName}</strong>
          <small>{user?.email}</small>
        </div>

        <div className="sidebar-card">
          <span className="sidebar-card__label">Enfoque de Quill</span>
          <ul className="sidebar-list">
            <li>Practica sin riesgo financiero real.</li>
            <li>Observa como se ejecuta una orden limite.</li>
            <li>Aprende leyendo tu portafolio y tus operaciones.</li>
          </ul>
        </div>
      </aside>

      <div className="app-content">
        <header className="app-header">
          <div>
            <p className="eyebrow">Plataforma Quill</p>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="header-actions">
            <ThemeToggle />
            <button className="secondary-button" onClick={logout} type="button">
              Cerrar sesion
            </button>
          </div>
        </header>

        <div className="app-main">{children}</div>
      </div>
    </div>
  );
}
