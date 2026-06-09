import { useAuth } from '../../auth/hooks/use-auth';
import { AppShell } from '../../../shared/layout/AppShell';
import { SectionCard } from '../../../shared/components/SectionCard';
import { settings } from '../../../shared/content/strings';
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
      title={settings.page.title}
      subtitle={settings.page.subtitle}
    >
      <ProfileInfoSection user={user} />

      <SectionCard
        title={settings.editProfile.title}
        description={settings.editProfile.description}
      >
        <EditProfileForm
          defaultValues={{
            fullName: user.fullName,
            username: user.username ?? '',
          }}
        />
      </SectionCard>

      <SectionCard
        title={settings.changeEmail.title}
        description={settings.changeEmail.description}
      >
        <ChangeEmailForm />
      </SectionCard>

      <SectionCard
        title={settings.changePassword.title}
        description={settings.changePassword.description}
      >
        <ChangePasswordForm />
      </SectionCard>
    </AppShell>
  );
}
