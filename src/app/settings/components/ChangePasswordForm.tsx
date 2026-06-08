import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import { useChangePasswordMutation } from '../../../shared/api/hooks';
import { useAuth } from '../../auth/hooks/use-auth';
import { PasswordField } from '../../../shared/components/PasswordField';
import { Button } from '../../../shared/components/Button';
import { formGrid } from '../../../shared/design-system/layout';
import { successMessage as successMsgClass, errorMessage as errorMsgClass } from '../../../shared/design-system/forms';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Tu contraseña actual es obligatoria.'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.'),
    confirmPassword: z
      .string()
      .min(8, 'Confirma la contraseña con al menos 8 caracteres.'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas deben coincidir.',
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const mutation = useChangePasswordMutation();
  const { register, handleSubmit, formState } = useForm<ChangePasswordFormValues>(
    {
      resolver: zodResolver(changePasswordSchema),
      defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    },
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSuccessMessage(null);
      await mutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setSuccessMessage('contraseña actualizada. Inicia sesión de nuevo.');
      setTimeout(() => {
        logout();
        navigate('/auth', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('[ChangePasswordForm] Password change failed:', error);
    }
  });

  return (
    <form className={formGrid} onSubmit={onSubmit}>
      {successMessage ? (
        <p className={successMsgClass}>{successMessage}</p>
      ) : null}
      {mutation.isError ? (
        <p className={errorMsgClass}>
          {getApiErrorMessage(mutation.error, 'No se pudo cambiar la contraseña.')}
        </p>
      ) : null}

      <PasswordField
        error={formState.errors.currentPassword?.message}
        hint="Tu contraseña actual para confirmar tu identidad."
        label="contraseña actual"
        {...register('currentPassword')}
      />

      <PasswordField
        error={formState.errors.newPassword?.message}
        hint="Debe tener al menos 8 caracteres."
        label="Nueva contraseña"
        {...register('newPassword')}
      />

      <PasswordField
        error={formState.errors.confirmPassword?.message}
        hint="Debe coincidir con la nueva contraseña."
        label="Confirmar nueva contraseña"
        {...register('confirmPassword')}
      />

      <Button
        disabled={formState.isSubmitting}
        type="submit"
      >
        {formState.isSubmitting ? 'Cambiando...' : 'Cambiar contraseña'}
      </Button>
    </form>
  );
}
