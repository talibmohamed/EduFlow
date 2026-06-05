import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function ParentDashboard() {
  const { user } = useAuth();

  // --- FAUSSES DONNÉES (Mocks) POUR L'EXEMPLE ---
  const childName = "Emma";
  
  // Historique de la semaine
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
  const weeklyMoods = ['😴', '🙂', '⚡', '🙂', '—']; // "—" car on est jeudi/vendredi et ce n'est pas encore rempli
  
  // Tâches du jour (simule ce qu'Emma a coché dans son espace)
  const tasks = [
    { id: 1, title: 'Lire une courte page de français', done: true },
    { id: 2, title: 'Trois petits calculs mathématiques', done: true },
    { id: 3, title: 'Relire la leçon de sciences', done: true },
    { id: 4, title: 'Écrire un poème de 4 lignes', done: true },
    { id: 5, title: 'Compléter la frise historique', done: false },
  ];

  const completedTasks = tasks.filter(t => t.done).length;
  const progressPercentage = Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      <Header />
      
      <main className="mx-auto w-full max-w-5xl flex-1 p-6 lg:p-10 space-y-8">
        
        {/* En-tête du tableau de bord */}
        <div className="mb-10 animate-rise">
          <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
            Le suivi de <em className="not-italic" style={{ color: 'var(--meadow)' }}>{childName}</em>
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Suis le rythme de {childName} et l'évolution de ses devoirs d'un simple coup d'œil.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* --- CARTE 1 : État de l'enfant --- */}
          <div className="paper-card p-6 sm:p-8 animate-rise" style={{ animationDelay: '100ms' }}>
            <h3 className="mb-6 font-display text-2xl text-ink flex items-center gap-3">
              <span aria-hidden className="text-[1.2em]">🙂</span>
              L'énergie de {childName}
            </h3>
            
            <div className="space-y-6">
              {/* Humeur du jour */}
              <div className="rounded-xl border border-border/40 bg-white/60 p-5 flex items-center gap-4">
                <div className="text-4xl">🙂</div>
                <div>
                  <div className="font-medium text-ink">En forme aujourd'hui</div>
                  <div className="text-sm text-muted-foreground">Rythme de travail : 3 à 5 missions recommandées.</div>
                </div>
              </div>

              {/* Historique de la semaine */}
              <div>
                <h4 className="text-sm font-medium text-ink/70 mb-3">Historique de la semaine</h4>
                <div className="flex justify-between items-center rounded-xl border border-border/40 bg-white/40 p-4">
                  {days.map((day, index) => (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase">{day}</span>
                      <span className="text-2xl">{weeklyMoods[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- CARTE 2 : Progression des devoirs --- */}
          <div className="paper-card p-6 sm:p-8 animate-rise" style={{ animationDelay: '200ms' }}>
            <div className="flex justify-between items-end mb-6">
              <h3 className="font-display text-2xl text-ink flex items-center gap-3">
                <span aria-hidden className="text-[1.2em]">📝</span>
                Progression du jour
              </h3>
              <span className="text-sm font-medium text-muted-foreground">
                {completedTasks} / {tasks.length} terminées
              </span>
            </div>

            <div className="space-y-6">
              {/* Barre de progression */}
              <div className="h-3 w-full rounded-full bg-white border border-border/40 overflow-hidden shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${progressPercentage}%`,
                    background: 'var(--meadow)'
                  }}
                />
              </div>

              {/* Liste des tâches */}
              <ul className="space-y-3 pt-2">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-start gap-3">
                    <div 
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                        task.done 
                          ? 'bg-[var(--meadow)] border-[var(--meadow)]' 
                          : 'border-border bg-white/50'
                      }`}
                    >
                      {task.done && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[14px] ${task.done ? 'line-through text-ink/40' : 'font-medium text-ink/80'}`}>
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>
        
      </main>
    </div>
  );
}