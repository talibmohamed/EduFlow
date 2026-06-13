import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const dashboardByRole = {
  child: '/child/dashboard',
  parent: '/parent/dashboard',
  teacher: '/teacher/dashboard',
};

export default function Forbidden() {
  const { user } = useAuth();
  const dashboardPath = dashboardByRole[user?.role] ?? '/';

  return (
    <div className="flex min-h-screen flex-col bg-linen text-ink selection:bg-[var(--sky)] selection:text-white">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center p-6 lg:p-10">
        <section className="paper-card max-w-2xl p-8 text-center sm:p-10">
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
            Cet espace ne t'est pas réservé.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            Tu peux retourner sur ton tableau de bord ou te reconnecter avec un autre compte.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="btn-paper btn-primary" to={dashboardPath}>
              Retourner à mon tableau de bord
            </Link>
            <Link className="btn-paper btn-ghost" to="/auth">
              Se reconnecter
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
