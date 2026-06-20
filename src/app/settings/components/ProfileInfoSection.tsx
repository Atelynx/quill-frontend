import type { UserProfile } from '../../../shared/api/validators';
import { surface, gradient } from '../../../shared/design-system/surfaces';
import { textSoft } from '../../../shared/design-system/typography';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';

interface ProfileInfoSectionProps {
  user: UserProfile;
}

export function ProfileInfoSection({ user }: ProfileInfoSectionProps) {
  return (
    <section className={`${surface.xl} ${gradient.card} p-5`}>
      <h3 className="m-0 mb-4 text-text">Informacion de la cuenta</h3>

      <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
        <div className={surface.innerCard}>
          <span className={`block text-[0.85rem] ${textSoft}`}>Nombre</span>
          <strong className="block mt-1 text-text">{user.fullName}</strong>
        </div>

        <div className={surface.innerCard}>
          <span className={`block text-[0.85rem] ${textSoft}`}>Nombre de usuario</span>
          <strong className="block mt-1 text-text">{user.username ?? '—'}</strong>
        </div>

        <div className={surface.innerCard}>
          <span className={`block text-[0.85rem] ${textSoft}`}>Correo</span>
          <strong className="block mt-1 text-text">{user.email}</strong>
        </div>

        <div className={surface.innerCard}>
          <span className={`block text-[0.85rem] ${textSoft}`}>Saldo disponible</span>
          <strong className="block mt-1 text-[var(--color-accent)]">
            <AnimatedCurrency value={user.availableBalance} />
          </strong>
        </div>
      </div>
    </section>
  );
}
