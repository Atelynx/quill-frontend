import type { UserProfile } from '../../../shared/api/validators';
import { surface, gradient } from '../../../shared/design-system/surfaces';
import { formatCurrency } from '../../../shared/utils/format';

interface ProfileInfoSectionProps {
  user: UserProfile;
}

export function ProfileInfoSection({ user }: ProfileInfoSectionProps) {
  return (
    <section className={`${surface.xl} ${gradient.card} p-5`}>
      <h3 className="m-0 mb-4 text-text">Informacion de la cuenta</h3>

      <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
        <div className="rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-4">
          <span className="block text-[0.85rem] text-[var(--main-page-text-soft)]">Nombre</span>
          <strong className="block mt-1 text-text">{user.fullName}</strong>
        </div>

        <div className="rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-4">
          <span className="block text-[0.85rem] text-[var(--main-page-text-soft)]">Nombre de usuario</span>
          <strong className="block mt-1 text-text">{user.username ?? '—'}</strong>
        </div>

        <div className="rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-4">
          <span className="block text-[0.85rem] text-[var(--main-page-text-soft)]">Correo</span>
          <strong className="block mt-1 text-text">{user.email}</strong>
        </div>

        <div className="rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-4">
          <span className="block text-[0.85rem] text-[var(--main-page-text-soft)]">Saldo disponible</span>
          <strong className="block mt-1 text-[var(--color-accent)]">
            {formatCurrency(user.availableBalance)}
          </strong>
        </div>
      </div>
    </section>
  );
}
