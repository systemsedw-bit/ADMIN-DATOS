import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseApp.js';
import { useAuth } from './AuthContext.jsx';

const DEFAULT_ROLE = 'Técnico';
const ROLES = ['Administrador', 'Técnico'];
const USER_ROLES_COLLECTION = 'userRoles';

function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    role: DEFAULT_ROLE
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? null;
  const { user, role } = useAuth();

  const redirectToRoleHome = useCallback(
    (userRole) => {
      if (!userRole) {
        return;
      }

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      navigate(userRole === 'Administrador' ? '/admin' : '/tecnico', { replace: true });
    },
    [from, navigate]
  );

  useEffect(() => {
    if (user && role) {
      redirectToRoleHome(role);
    }
  }, [user, role, redirectToRoleHome]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const persistSession = async () => {
    await setPersistence(auth, browserLocalPersistence);
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await persistSession();
      const credentials = await signInWithEmailAndPassword(auth, formValues.email, formValues.password);
      const roleDocRef = doc(db, USER_ROLES_COLLECTION, credentials.user.uid);
      const roleSnapshot = await getDoc(roleDocRef);

      if (!roleSnapshot.exists()) {
        await signOut(auth);
        setError('Tu cuenta no tiene un rol asignado. Contacta al administrador.');
        return;
      }

      const storedRole = roleSnapshot.data().role;
      redirectToRoleHome(storedRole);
    } catch (err) {
      console.error(err);
      setError('No fue posible iniciar sesión. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await persistSession();
      const credentials = await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );
      await setDoc(doc(db, USER_ROLES_COLLECTION, credentials.user.uid), {
        role: formValues.role,
        createdAt: serverTimestamp()
      });
      redirectToRoleHome(formValues.role);
    } catch (err) {
      console.error(err);
      setError('No fue posible crear la cuenta. Intenta con otro correo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.email || !formValues.password) {
      setError('Debes ingresar tu correo y contraseña.');
      return;
    }

    if (isRegisterMode) {
      await handleRegister();
    } else {
      await handleLogin();
    }
  };

  const toggleMode = () => {
    setIsRegisterMode((prev) => !prev);
    setFormValues({ email: '', password: '', role: DEFAULT_ROLE });
    setError('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100 via-slate-100 to-primary-200 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-10 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-primary-700">Admin Datos</h1>
          <p className="mt-2 text-sm text-slate-500">
            {isRegisterMode
              ? 'Crea una cuenta para continuar'
              : 'Inicia sesión con tu correo y contraseña'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formValues.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none ring-primary-200 transition focus:border-primary-400 focus:ring-2"
              placeholder="ejemplo@empresa.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              required
              value={formValues.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none ring-primary-200 transition focus:border-primary-400 focus:ring-2"
              placeholder="••••••••"
              minLength={6}
            />
            <p className="text-xs text-slate-400">La contraseña debe tener al menos 6 caracteres.</p>
          </div>

          {isRegisterMode && (
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                Rol
              </label>
              <select
                id="role"
                name="role"
                value={formValues.role}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none ring-primary-200 transition focus:border-primary-400 focus:ring-2"
              >
                {ROLES.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {roleOption}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">
                El rol determina la sección inicial del panel al iniciar sesión.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-2xl bg-primary-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-primary-300"
            disabled={loading}
          >
            {loading ? 'Procesando...' : isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-8 space-y-3 text-center text-sm text-slate-500">
          <p>
            {isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              onClick={toggleMode}
              className="font-semibold text-primary-600 transition hover:text-primary-500"
              type="button"
            >
              {isRegisterMode ? 'Inicia sesión' : 'Crea una cuenta'}
            </button>
          </p>

          {!isRegisterMode && (
            <p>
              ¿Olvidaste tu contraseña?{' '}
              <Link
                to="#recuperar"
                className="font-semibold text-primary-600 transition hover:text-primary-500"
              >
                Contacta al administrador
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
