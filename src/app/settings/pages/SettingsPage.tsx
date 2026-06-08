import { useAuth } from '../../auth/hooks/use-auth';
import { AppShell } from '../../../shared/layout/AppShell';
import { SectionCard } from '../../../shared/components/SectionCard';
import { ProfileInfoSection } from '../components/ProfileInfoSection';
import { EditProfileForm } from '../components/EditProfileForm';
import { ChangeEmailForm } from '../components/ChangeEmailForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';

export function SettingsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <AppShell
      title="Configuracion de perfil"
      subtitle="Administra tu informacion personal, correo y contraseña."
    >
      <ProfileInfoSection user={user} />

      <SectionCard
        title="Editar perfil"
        description="Actualiza tu nombre y nombre de usuario publico."
      >
        <EditProfileForm
          defaultValues={{
            fullName: user.fullName,
            username: user.username ?? '',
          }}
        />
      </SectionCard>

      <SectionCard
        title="Cambiar correo"
        description="Recibiras un aviso. Despues de cambiar el correo tendras que iniciar sesión de nuevo."
      >
        <ChangeEmailForm />
      </SectionCard>

      <SectionCard
        title="Cambiar contraseña"
        description="Usa una contraseña segura. Despues de cambiarla tendras que iniciar sesión de nuevo."
      >
        <ChangePasswordForm />
      </SectionCard>
    </AppShell>
  );
}
