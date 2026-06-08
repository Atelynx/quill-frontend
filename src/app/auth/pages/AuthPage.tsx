import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import { PasswordField } from '../../../shared/components/PasswordField';
import { ThemeToggle } from '../../../shared/components/ThemeToggle';
import { useAuth } from '../hooks/use-auth';
import { button, surface, gradient } from '../../../shared/design-system/surfaces';
import { eyebrow, fieldLabel, fieldError } from '../../../shared/design-system/typography';
import { authGrid, authTopbar, authHero, authCard, authTabs, authTabButton, authTabActive, authStatusStack, heroMetrics, heroMetricCard, formGrid, fieldGroup } from '../../../shared/design-system/layout';
import { inputBase, successMessage as successMsgClass, errorMessage as errorMsgClass } from '../../../shared/design-system/forms';

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo valido.'),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres.'),
});

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Ingresa tu nombre completo.'),
    email: z.string().email('Ingresa un correo valido.'),
    password: z
      .string()
      .min(8, 'La contrasena debe tener al menos 8 caracteres.'),
    confirmPassword: z
      .string()
      .min(8, 'Confirma la contrasena con al menos 8 caracteres.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contrasenas deben coincidir.',
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      void navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLogin = loginForm.handleSubmit(async (values) => {
    try {
      setErrorMessage(null);
      await login(values);
      void navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'No fue posible iniciar sesion. Revisa tus credenciales.',
        ),
      );
    }
  });

  const handleRegister = registerForm.handleSubmit(async (values) => {
    try {
      setErrorMessage(null);
      const result = await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });

      setSuccessMessage(result.message);
      setMode('login');
      registerForm.reset();
      loginForm.reset({
        email: values.email,
        password: '',
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'No fue posible crear tu cuenta. Verifica los datos.',
        ),
      );
    }
  });

  return (
    <main className={authGrid}>
      <div className={authTopbar}>
        <div>
          <p className={eyebrow}>Atelynx presenta</p>
          <h2 className="mt-[0.15rem] text-[1.3rem] m-0">Quill</h2>
        </div>
        <ThemeToggle />
      </div>

      <section className={`${surface.xl} ${gradient.hero} ${authHero}`}>
        <div>
          <p className={eyebrow}>Simulador educativo</p>
          <h1 className="my-4 text-[clamp(2.3rem,4vw,4.5rem)] leading-[0.95]">Aprende a invertir entendiendo cada decision.</h1>
          <p className="m-0 text-[1.08rem] text-[var(--main-page-inverse-text-soft)]">
            Quill combina mercado simulado, ordenes limite, comisiones y
            portafolio para practicar con una experiencia clara, seria y sin
            dinero real.
          </p>
        </div>

        <div className={heroMetrics}>
          <article className={heroMetricCard}>
            <strong className="text-[var(--main-page-inverse-text-soft)]">Registro seguro y directo</strong>
            <span className="block mt-1 text-[var(--main-page-inverse-text-muted)]">Crea tu cuenta y entra manualmente cuando estes listo.</span>
          </article>
          <article className={heroMetricCard}>
            <strong className="text-[var(--main-page-inverse-text-soft)]">Mercado con actividad</strong>
            <span className="block mt-1 text-[var(--main-page-inverse-text-muted)]">Precios, graficas y actualizaciones con sensacion de flujo.</span>
          </article>
          <article className={heroMetricCard}>
            <strong className="text-[var(--main-page-inverse-text-soft)]">Aprendizaje guiado</strong>
            <span className="block mt-1 text-[var(--main-page-inverse-text-muted)]">Quill explica lo importante sin llenar la pantalla de ruido.</span>
          </article>
        </div>
      </section>

      <section className={`${surface.xl} ${gradient.card} ${authCard}`}>
        <div className={authTabs} role="tablist" aria-label="Cambiar formulario">
          <button
            aria-selected={mode === 'login'}
            className={`${authTabButton} ${mode === 'login' ? authTabActive : ''}`}
            onClick={() => {
              setErrorMessage(null);
              setMode('login');
            }}
            type="button"
          >
            Iniciar sesion
          </button>
          <button
            aria-selected={mode === 'register'}
            className={`${authTabButton} ${mode === 'register' ? authTabActive : ''}`}
            onClick={() => {
              setErrorMessage(null);
              setMode('register');
            }}
            type="button"
          >
            Crear cuenta
          </button>
        </div>

        <div className={authStatusStack} aria-live="polite">
          {successMessage ? (
            <p className={successMsgClass}>{successMessage}</p>
          ) : null}
          {errorMessage ? <p className={errorMsgClass}>{errorMessage}</p> : null}
        </div>

        {mode === 'login' ? (
          <form className={formGrid} onSubmit={handleLogin}>
            <label className={fieldGroup}>
              <span className={fieldLabel}>Correo</span>
              <input className={inputBase} type="email" {...loginForm.register('email')} />
              <span className={fieldError}>
                {loginForm.formState.errors.email?.message}
              </span>
            </label>

            <PasswordField
              error={loginForm.formState.errors.password?.message}
              hint="Usa la contrasena con la que creaste tu cuenta."
              label="Contrasena"
              {...loginForm.register('password')}
            />

            <button
              className={`${button.base} ${button.primary}`}
              disabled={loginForm.formState.isSubmitting}
              type="submit"
            >
              {loginForm.formState.isSubmitting ? 'Ingresando...' : 'Entrar a Quill'}
            </button>
          </form>
        ) : (
          <form className={formGrid} onSubmit={handleRegister}>
            <label className={fieldGroup}>
              <span className={fieldLabel}>Nombre completo</span>
              <input className={inputBase} type="text" {...registerForm.register('fullName')} />
              <span className={fieldError}>
                {registerForm.formState.errors.fullName?.message}
              </span>
            </label>

            <label className={fieldGroup}>
              <span className={fieldLabel}>Correo</span>
              <input className={inputBase} type="email" {...registerForm.register('email')} />
              <span className={fieldError}>
                {registerForm.formState.errors.email?.message}
              </span>
            </label>

            <PasswordField
              error={registerForm.formState.errors.password?.message}
              hint="Usa al menos 8 caracteres."
              label="Contrasena"
              {...registerForm.register('password')}
            />

            <PasswordField
              error={registerForm.formState.errors.confirmPassword?.message}
              hint="Debe coincidir exactamente con la contrasena principal."
              label="Confirmar contrasena"
              {...registerForm.register('confirmPassword')}
            />

            <button
              className={`${button.base} ${button.primary}`}
              disabled={registerForm.formState.isSubmitting}
              type="submit"
            >
              {registerForm.formState.isSubmitting
                ? 'Creando cuenta...'
                : 'Crear cuenta'}
            </button>
          </form>
        )}

        <p className="mt-4 text-[0.95rem] text-[var(--main-page-text-soft)]">
          Quill no usa dinero real. El acceso al dashboard requiere iniciar
          sesion manualmente despues de crear tu cuenta.
        </p>
      </section>
    </main>
  );
}
