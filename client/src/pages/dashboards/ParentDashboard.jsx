import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function ParentDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      <Header />
      
      <main className="mx-auto w-full max-w-5xl flex-1 p-6 lg:p-10">
        
        {/* En-tête du tableau de bord */}
        <div className="mb-10 animate-rise">
          <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
            Vue d'ensemble — Famille <em className="not-italic" style={{ color: 'var(--meadow)' }}>{user.name}</em>
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Suis le rythme de ton enfant et l'évolution de ses devoirs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Carte État de l'enfant */}
          <div className="paper-card p-6 sm:p-8 animate-rise" style={{ animationDelay: '100ms' }}>
            <h3 className="mb-5 font-display text-2xl text-ink flex items-center gap-3">
              <span aria-hidden className="text-[1.2em]">🙂</span>
              État de mon enfant
            </h3>
            <div className="rounded-xl border-2 border-dashed border-border/40 bg-white/40 p-8 text-center text-[15px] text-muted-foreground italic">
              [Historique énergie et concentration ici]
            </div>
          </div>

          {/* Carte Progression */}
          <div className="paper-card p-6 sm:p-8 animate-rise" style={{ animationDelay: '200ms' }}>
            <h3 className="mb-5 font-display text-2xl text-ink flex items-center gap-3">
              <span aria-hidden className="text-[1.2em]">📝</span>
              Progression des devoirs
            </h3>
            <div className="rounded-xl border-2 border-dashed border-border/40 bg-white/40 p-8 text-center text-[15px] text-muted-foreground italic">
              [Liste des tâches terminées et reportées ici]
            </div>
          </div>
          
        </div>
        
      </main>
    </div>
  );
}