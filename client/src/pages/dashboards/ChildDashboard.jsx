import { useState } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

// Les 3 niveaux d'énergie tirés de ton design system
const energyLevels = [
  { key: 'rest', glyph: '😴', label: 'Fatigué(e)', note: 'Une journée douce en perspective.' },
  { key: 'calm', glyph: '🙂', label: 'En forme', note: 'Le rythme parfait pour avancer.' },
  { key: 'spark', glyph: '⚡', label: 'Au top', note: 'Prêt(e) à relever tous les défis !' },
];

export default function ChildDashboard() {
  const { user } = useAuth();
  // On initialise l'énergie sur "calm" (🙂) par défaut
  const [energy, setEnergy] = useState('calm');

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      <Header />
      
      <main className="mx-auto w-full max-w-4xl flex-1 p-6 lg:p-10 space-y-12">
        
        {/* Zone 1: L'état du jour (Interactif) */}
        <section className="animate-rise">
          <h2 className="mb-6 font-display text-3xl sm:text-4xl text-ink leading-tight text-center sm:text-left">
            Comment te sens-tu aujourd'hui, <em className="not-italic" style={{ color: 'var(--sky)' }}>{user.name}</em> ?
          </h2>
          
          <div className="paper-card p-8 sm:p-10 flex flex-col items-center justify-center">
            
            {/* Le sélecteur d'humeur */}
            <div 
              className="flex items-center justify-center gap-6 sm:gap-12" 
              role="radiogroup" 
              aria-label="Niveau d'énergie"
            >
              {energyLevels.map((level) => {
                const isActive = energy === level.key;
                return (
                  <button
                    key={level.key}
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setEnergy(level.key)}
                    className={`relative text-5xl sm:text-6xl transition-all duration-300 ${
                      isActive ? 'scale-125 opacity-100' : 'scale-90 opacity-50 hover:opacity-80 hover:scale-105'
                    }`}
                  >
                    <span aria-hidden>{level.glyph}</span>
                    {/* Le halo coloré derrière l'émoji actif */}
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute -inset-4 rounded-full -z-10 animate-rise"
                        style={{ background: 'radial-gradient(circle, oklch(0.86 0.16 95 / 0.25), transparent 70%)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Le petit message rassurant qui change selon l'humeur */}
            <p className="mt-8 text-[16px] font-medium text-ink/75 transition-all duration-300">
              {energyLevels.find(e => e.key === energy)?.note}
            </p>
          </div>
        </section>

        {/* Zone 2: Devoirs adaptés */}
        <section className="animate-rise" style={{ animationDelay: '100ms' }}>
          <h2 className="mb-5 font-display text-2xl sm:text-3xl text-ink flex items-center gap-3">
            <span aria-hidden className="text-[1.2em]">📝</span>
            Tes missions du jour
          </h2>
          <div className="paper-card p-6 sm:p-8">
            {/* L'interface change visuellement pour montrer que l'humeur a un impact */}
            <div className="rounded-xl border-2 border-dashed border-border/40 bg-white/40 p-8 text-center text-[15px] text-muted-foreground">
              {energy === 'rest' && "L'objectif d'aujourd'hui : 1 seule mission très courte."}
              {energy === 'calm' && "L'objectif d'aujourd'hui : 3 missions pour avancer à ton rythme."}
              {energy === 'spark' && "L'objectif d'aujourd'hui : 5 missions pour utiliser toute cette énergie !"}
              
              <br /><br /><span className="italic opacity-70">[La vraie liste des sous-tâches viendra ici]</span>
            </div>
          </div>
        </section>

        {/* Zone 3: Progression positive */}
        <section className="animate-rise" style={{ animationDelay: '200ms' }}>
          <h2 className="mb-5 font-display text-2xl sm:text-3xl text-ink flex items-center gap-3">
            <span aria-hidden className="text-[1.2em]">🌱</span>
            Ta progression
          </h2>
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