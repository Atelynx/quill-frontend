import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import { useChangeEmailMutation } from '../../../shared/api/hooks';
import { useAuth } from '../../auth/hooks/use-auth';
import { PasswordField } from '../../../shared/components/PasswordField';
import { Button } from '../../../shared/components/Button';
import { fieldLabel, fieldError } from '../../../shared/design-system/typography';
import { formGrid, fieldGroup } from '../../../shared/design-system/layout';
import { inputBase, successMessage as successMsgClass, errorMessage as errorMsgClass } from '../../../shared/design-system/forms';

const changeEmailSchema = z.object({
  newEmail: z.string().email('Ingresa un correo valido.'),
  currentPassword: z.string().min(1, 'Tu contrasena actual es obligatoria.'),
});

type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

export function ChangeEmailForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const mutation = useChangeEmailMutation();
  const { register, handleSubmit, formState } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: '', currentPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSuccessMessage(null);
      await mutation.mutateAsync(values);
      setSuccessMessage('Correo actualizado. Inicia sesion de nuevo.');
      setTimeout(() => {
        logout();
        void navigate('/auth', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('[ChangeEmailForm] Email change failed:', error);
    }
  });

  return (
    <form className={formGrid} onSubmit={onSubmit}>
      {successMessage ? (
        <p className={successMsgClass}>{successMessage}</p>
      ) : null}
      {mutation.isError ? (
        <p className={errorMsgClass}>
          {getApiErrorMessage(mutation.error, 'No se pudo cambiar el correo.')}
        </p>
      ) : null}

      <label className={fieldGroup}>
        <span className={fieldLabel}>Nuevo correo</span>
        <input className={inputBase} type="email" {...register('newEmail')} />
        <span className={fieldError}>
          {formState.errors.newEmail?.message}
        </span>
      </label>

      <PasswordField
        error={formState.errors.currentPassword?.message}
        hint="Confirma tu identidad con tu contrasena actual."
        label="Contrasena actual"
        {...register('currentPassword')}
      />

      <Button
        disabled={formState.isSubmitting}
        type="submit"
      >
        {formState.isSubmitting ? 'Cambiando...' : 'Cambiar correo'}
      </Button>
    </form>
  );
}
