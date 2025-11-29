import { useAuth } from '../auth/AuthContext.jsx';

function DashboardLayout({ role }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-primary-700">Panel {role}</h1>
            <p className="text-sm text-slate-500">Bienvenido, {user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-medium text-primary-600 transition hover:bg-primary-50"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <section className="rounded-3xl border border-dashed border-primary-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          <h2 className="text-2xl font-semibold text-primary-600">Área restringida</h2>
          <p className="mt-3">
            Esta sección está disponible únicamente para usuarios con el rol de {role}. Puedes comenzar a
            construir las funcionalidades específicas desde aquí.
          </p>
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
