import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function ChildDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      <Header />
      
      <main className="mx-auto w-full max-w-4xl flex-1 p-6 lg:p-10 space-y-12">
        
        {/* Zone 1: État du jour */}
        <section className="animate-rise">
          <h2 className="mb-5 font-display text-3xl sm:text-4xl text-ink leading-tight">
            Comment te sens-tu aujourd'hui, <em className="not-italic" style={{ color: 'var(--sky)' }}>{user.name}</em> ?
          </h2>
          <div className="paper-card p-6 sm:p-8">
            <div className="rounded-xl border-2 border-dashed border-border/40 bg-white/40 p-8 text-center text-[15px] text-muted-foreground italic">
              [Le formulaire Énergie / Concentration viendra ici]
            </div>
          </div>
        </section>

        {/* Zone 2: Devoirs adaptés */}
        <section className="animate-rise" style={{ animationDelay: '100ms' }}>
          <h2 className="mb-5 font-display text-2xl sm:text-3xl text-ink flex items-center gap-3">
            <span aria-hidden className="text-[1.2em]">📝</span>
            Tes missions du jour
          </h2>
          <div className="paper-card p-6 sm:p-8">
            <div className="rounded-xl border-2 border-dashed border-border/40 bg-white/40 p-8 text-center text-[15px] text-muted-foreground italic">
              [La liste des devoirs recommandés viendra ici]
            </div>
          </div>
        </section>

        {/* Zone 3: Progression positive */}
        <section className="animate-rise" style={{ animationDelay: '200ms' }}>
          <h2 className="mb-5 font-display text-2xl sm:text-3xl text-ink flex items-center gap-3">
            <span aria-hidden className="text-[1.2em]">🌱</span>
            Ta progression
          </h2>
          {/* Style spécifique "succès" utilisant var(--meadow) au lieu du vert standard Tailwind */}
          <div className="paper-card p-6 sm:p-8 border-t-4 shadow-sm" style={{ borderTopColor: 'var(--meadow)' }}>
            <div 
              className="rounded-xl border-2 border-dashed p-8 text-center text-[15px] font-medium italic"
              style={{ borderColor: 'color-mix(in srgb, var(--meadow) 40%, transparent)', color: 'var(--ink)', opacity: 0.85 }}
            >
              [Les messages positifs et les tâches terminées viendront ici]
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}