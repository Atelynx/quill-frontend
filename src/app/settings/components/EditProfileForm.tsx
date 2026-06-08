import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import { useUpdateProfileMutation } from '../../../shared/api/hooks';
import { useAuth } from '../../auth/hooks/use-auth';
import { labels, settings } from '../../../shared/content/strings';
import { Button } from '../../../shared/components/Button';
import { fieldLabel, fieldError } from '../../../shared/design-system/typography';
import { formGrid, fieldGroup } from '../../../shared/design-system/layout';
import { inputBase, successMessage as successMsgClass, errorMessage as errorMsgClass } from '../../../shared/design-system/forms';

const editProfileSchema = z.object({
  fullName: z.string().min(1, 'El nombre es obligatorio'),
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, numeros y guion bajo')
    .optional()
    .or(z.literal('')),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  defaultValues: EditProfileFormValues;
}

export function EditProfileForm({ defaultValues }: EditProfileFormProps) {
  const mutation = useUpdateProfileMutation();
  const { updateUser } = useAuth();
  const { register, handleSubmit, formState } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const updatedProfile = await mutation.mutateAsync(values);
      updateUser(updatedProfile);
    } catch (error) {
      console.error('[EditProfileForm] Update failed:', error);
    }
  });

  return (
    <form className={formGrid} onSubmit={onSubmit}>
      {mutation.isSuccess ? (
        <p className={successMsgClass}>{settings.editProfile.success}</p>
      ) : null}
      {mutation.isError ? (
        <p className={errorMsgClass}>
          {getApiErrorMessage(mutation.error, settings.editProfile.error)}
        </p>
      ) : null}

      <label className={fieldGroup}>
        <span className={fieldLabel}>{labels.field.fullName}</span>
        <input className={inputBase} type="text" {...register('fullName')} />
        <span className={fieldError}>
          {formState.errors.fullName?.message}
        </span>
      </label>

      <label className={fieldGroup}>
        <span className={fieldLabel}>{labels.field.username}</span>
        <input
          className={inputBase}
          type="text"
          placeholder={labels.field.usernamePlaceholder}
          {...register('username')}
        />
        <span className={fieldError}>
          {formState.errors.username?.message}
        </span>
      </label>

      <Button
        disabled={formState.isSubmitting}
        type="submit"
      >
        {formState.isSubmitting ? labels.action.saving : labels.action.save}
      </Button>
    </form>
  );
}
