import { useState } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

// Les 3 niveaux d'énergie
const energyLevels = [
  { key: 'rest', glyph: '😴', label: 'Fatigué(e)', note: 'Une journée douce en perspective.' },
  { key: 'calm', glyph: '🙂', label: 'En forme', note: 'Le rythme parfait pour avancer.' },
  { key: 'spark', glyph: '⚡', label: 'Au top', note: 'Prêt(e) à relever tous les défis !' },
];

// Les missions "mockées" (fausses données) qui changent selon l'énergie
const tasksByEnergy = {
  rest: [
    { id: 't1', title: 'Lire une courte page de français', meta: '5 min' },
  ],
  calm: [
    { id: 't1', title: 'Lire une courte page de français', meta: '5 min' },
    { id: 't2', title: 'Trois petits calculs mathématiques', meta: '10 min' },
    { id: 't3', title: 'Relire la leçon de sciences', meta: '10 min' },
  ],
  spark: [
    { id: 't1', title: 'Lire une courte page de français', meta: '5 min' },
    { id: 't2', title: 'Trois petits calculs mathématiques', meta: '10 min' },
    { id: 't3', title: 'Relire la leçon de sciences', meta: '10 min' },
    { id: 't4', title: 'Écrire un poème de 4 lignes', meta: '15 min' },
    { id: 't5', title: 'Compléter la frise historique', meta: '15 min' },
  ],
};

export default function ChildDashboard() {
  const { user } = useAuth();
  
  // États de la page
  const [energy, setEnergy] = useState('calm');
  const [completedTasks, setCompletedTasks] = useState([]); // Garde en mémoire les IDs des tâches terminées

  // Les tâches actuelles basées sur l'énergie sélectionnée
  const currentTasks = tasksByEnergy[energy];

  // Fonction pour cocher/décocher une tâche
  const toggleTask = (taskId) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId) // Si déjà cochée, on la décoche
        : [...prev, taskId] // Sinon on l'ajoute à la liste des terminées
    );
  };

  // Calcul de la progression
  const progressPercentage = Math.round((completedTasks.length / currentTasks.length) * 100);
  const isAllDone = completedTasks.length === currentTasks.length && currentTasks.length > 0;

  // Si l'enfant change d'humeur, on peut décider de réinitialiser les tâches (optionnel, ici on garde les tâches cochées si l'ID correspond)

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      <Header />
      
      <main className="mx-auto w-full max-w-4xl flex-1 p-6 lg:p-10 space-y-12">
        
        {/* --- Zone 1: L'état du jour --- */}
        <section className="animate-rise">
          <h2 className="mb-6 font-display text-3xl sm:text-4xl text-ink leading-tight text-center sm:text-left">
            Comment te sens-tu aujourd'hui, <em className="not-italic" style={{ color: 'var(--sky)' }}>{user.name}</em> ?
          </h2>
          
          <div className="paper-card p-8 sm:p-10 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-6 sm:gap-12" role="radiogroup" aria-label="Niveau d'énergie">
              {energyLevels.map((level) => {
                const isActive = energy === level.key;
                return (
                  <button
                    key={level.key}
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => {
                      setEnergy(level.key);
                      // Décommenter la ligne dessous si tu veux vider les cases quand on change d'humeur :
                      // setCompletedTasks([]); 
                    }}
                    className={`relative text-5xl sm:text-6xl transition-all duration-300 ${
                      isActive ? 'scale-125 opacity-100' : 'scale-90 opacity-50 hover:opacity-80 hover:scale-105'
                    }`}
                  >
                    <span aria-hidden>{level.glyph}</span>
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
            <p className="mt-8 text-[16px] font-medium text-ink/75 transition-all duration-300">
              {energyLevels.find(e => e.key === energy)?.note}
            </p>
          </div>
        </section>

        {/* --- Zone 2: Devoirs adaptés (Interactif) --- */}
        <section className="animate-rise" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-3">
              <span aria-hidden className="text-[1.2em]">📝</span>
              Tes missions du jour
            </h2>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {completedTasks.length} / {currentTasks.length}
            </span>
          </div>

          <div className="paper-card p-4 sm:p-6">
            <ul className="space-y-3">
              {currentTasks.map((task) => {
                const isDone = completedTasks.includes(task.id);
                
                return (
                  <li
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                      isDone 
                        ? 'bg-white/40 border-transparent opacity-75' 
                        : 'bg-white/80 border-border/40 hover:border-border/80 shadow-sm'
                    }`}
                  >
                    {/* Fausse case à cocher personnalisée */}
                    <div 
                      className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isDone 
                          ? 'bg-[var(--meadow)] border-[var(--meadow)] scale-110' 
                          : 'border-[var(--meadow)] group-hover:bg-[var(--meadow)]/10'
                      }`}
                    >
                      {isDone && (
                        <svg className="h-4 w-4 text-white animate-rise" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    {/* Texte de la tâche */}
                    <div className="flex-1">
                      <div className={`text-[15px] transition-all duration-300 ${isDone ? 'line-through text-ink/40' : 'font-medium text-ink'}`}>
                        {task.title}
                      </div>
                      <div className={`text-sm mt-0.5 transition-all duration-300 ${isDone ? 'text-ink/30' : 'text-muted-foreground'}`}>
                        {task.meta}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* --- Zone 3: Progression positive (Dynamique) --- */}
        <section className="animate-rise" style={{ animationDelay: '200ms' }}>
          <h2 className="mb-5 font-display text-2xl sm:text-3xl text-ink flex items-center gap-3">
            <span aria-hidden className="text-[1.2em]">🌱</span>
            Ta progression
          </h2>
          <div className="paper-card p-6 sm:p-8 border-t-4 shadow-sm transition-all duration-500" style={{ borderTopColor: isAllDone ? 'var(--meadow)' : 'var(--clay)' }}>
            
            {completedTasks.length === 0 ? (
              <div className="text-center text-[15px] font-medium text-muted-foreground italic py-4">
                Touche une mission quand tu as terminé pour faire grandir la barre !
              </div>
            ) : (
              <div className="space-y-6">
                {/* Message dynamique */}
                <div className="text-center text-lg font-medium" style={{ color: isAllDone ? 'var(--meadow)' : 'var(--ink)' }}>
                  {isAllDone 
                    ? "Bravo Emma ! Tu as terminé toutes tes missions pour aujourd'hui. 🎉" 
                    : "Super début ! Continue comme ça."}
                </div>

                {/* Barre de progression visuelle */}
                <div className="h-3 w-full rounded-full bg-white/60 overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${progressPercentage}%`,
                      background: 'var(--meadow)'
                    }}
                  />
                </div>
              </div>
            )}

          </div>
        </section>

      </main>
    </div>
  );
}