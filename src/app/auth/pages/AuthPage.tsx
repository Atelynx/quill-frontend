import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import { PasswordField } from '../../../shared/components/PasswordField';
import { ThemeToggle } from '../../../shared/components/ThemeToggle';
import { useAuth } from '../hooks/use-auth';
import '../auth-page.css';

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
  const { login, register } = useAuth();

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
    <main className="auth-page">
      <div className="auth-topbar">
        <div className="auth-brand-lockup">
          <p className="eyebrow">Atelynx presenta</p>
          <h2>Quill</h2>
        </div>
        <ThemeToggle />
      </div>

      <section className="auth-hero">
        <div>
          <p className="eyebrow">Simulador educativo</p>
          <h1>Aprende a invertir entendiendo cada decision.</h1>
          <p className="lead">
            Quill combina mercado simulado, ordenes limite, comisiones y
            portafolio para practicar con una experiencia clara, seria y sin
            dinero real.
          </p>
        </div>

        <div className="hero-metrics">
          <article>
            <strong>Registro seguro y directo</strong>
            <span>Crea tu cuenta y entra manualmente cuando estes listo.</span>
          </article>
          <article>
            <strong>Mercado con actividad</strong>
            <span>Precios, graficas y actualizaciones con sensacion de flujo.</span>
          </article>
          <article>
            <strong>Aprendizaje guiado</strong>
            <span>Quill explica lo importante sin llenar la pantalla de ruido.</span>
          </article>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-tabs" role="tablist" aria-label="Cambiar formulario">
          <button
            aria-selected={mode === 'login'}
            className={mode === 'login' ? 'is-active' : ''}
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
            className={mode === 'register' ? 'is-active' : ''}
            onClick={() => {
              setErrorMessage(null);
              setMode('register');
            }}
            type="button"
          >
            Crear cuenta
          </button>
        </div>

        <div className="auth-status-stack" aria-live="polite">
          {successMessage ? (
            <p className="form-success">{successMessage}</p>
          ) : null}
          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        </div>

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <label className="field-group">
              <span className="field-group__label">Correo</span>
              <input type="email" {...loginForm.register('email')} />
              <span className="field-group__error">
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
              className="primary-button"
              disabled={loginForm.formState.isSubmitting}
              type="submit"
            >
              {loginForm.formState.isSubmitting ? 'Ingresando...' : 'Entrar a Quill'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <label className="field-group">
              <span className="field-group__label">Nombre completo</span>
              <input type="text" {...registerForm.register('fullName')} />
              <span className="field-group__error">
                {registerForm.formState.errors.fullName?.message}
              </span>
            </label>

            <label className="field-group">
              <span className="field-group__label">Correo</span>
              <input type="email" {...registerForm.register('email')} />
              <span className="field-group__error">
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
              className="primary-button"
              disabled={registerForm.formState.isSubmitting}
              type="submit"
            >
              {registerForm.formState.isSubmitting
                ? 'Creando cuenta...'
                : 'Crear cuenta'}
            </button>
          </form>
        )}

        <p className="auth-footnote">
          Quill no usa dinero real. El acceso al dashboard requiere iniciar
          sesion manualmente despues de crear tu cuenta.
        </p>
      </section>
    </main>
  );
}
