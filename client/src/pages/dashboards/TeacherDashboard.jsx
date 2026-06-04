import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      <Header />
      
      <main className="mx-auto w-full max-w-5xl flex-1 p-6 lg:p-10">
        
        {/* En-tête du tableau de bord */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center animate-rise">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
              Espace Enseignant
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Bonjour {user.name} — Voici le résumé de ton espace.
            </p>
          </div>
          
          <Link
            to="/teacher/homework/create"
            className="btn-paper btn-primary flex-shrink-0"
          >
            + Créer un nouveau devoir
          </Link>
        </div>

        {/* Bloc Liste des élèves */}
        <div className="paper-card animate-rise" style={{ animationDelay: '100ms' }}>
          <div className="border-b border-border/40 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Mes élèves assignés</h2>
          </div>
          <div className="p-12 text-center text-[15px] text-muted-foreground italic">
            [Liste des enfants et résumé hebdomadaire ici]
          </div>
        </div>
        
      </main>
    </div>
  );
}