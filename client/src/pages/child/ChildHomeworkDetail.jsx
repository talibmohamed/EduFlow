import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import { EmptyState } from '../../components/ui';

// --- FAUSSES DONNÉES POUR TESTER L'UI ---
const mockHomeworkData = {
  id: "hw-123",
  title: "Les fractions simples",
  subject: "Mathématiques",
  estimatedMinutes: 20,
  tasks: [
    { id: "t1", title: "Lire le résumé de la leçon", status: "completed" },
    { id: "t2", title: "Faire le premier exercice", status: "pending" },
    { id: "t3", title: "Faire le jeu des parts de pizza", status: "pending" },
  ]
};

export default function ChildHomeworkDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [homework, setHomework] = useState(null);

  // Simule l'appel API au chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setHomework(mockHomeworkData);
      setLoading(false);
    }, 600); // Petit délai pour voir l'état de chargement
    return () => clearTimeout(timer);
  }, [id]);

  // Actions locales pour tester l'UI (à remplacer par api.patch plus tard)
  const handleTaskAction = (taskId, action) => {
    setHomework(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: action === 'complete' ? 'completed' : 'postponed' };
        }
        return task;
      })
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linen text-ink flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="paper-card p-10 text-center text-[15px] font-medium text-muted-foreground animate-pulse">
            Ouverture de ton cahier...
          </div>
        </main>
      </div>
    );
  }

  if (!homework) return null;

  const completedCount = homework.tasks.filter(t => t.status === 'completed').length;
  const totalCount = homework.tasks.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllDone = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="min-h-screen bg-linen text-ink selection:bg-[var(--sky)] selection:text-white">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 p-6 lg:p-10 space-y-8 animate-rise">
        
        {/* --- BOUTON RETOUR --- */}
        <div>
          <Link 
            to="/child/dashboard" 
            className="inline-flex items-center gap-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-ink"
          >
            <span aria-hidden className="text-lg">←</span> Retour au tableau de bord
          </Link>
        </div>

        {/* --- EN-TÊTE DU DEVOIR --- */}
        <header className="paper-card p-8 sm:p-10 border-t-4" style={{ borderTopColor: 'var(--sky)' }}>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
            {homework.subject} • ~{homework.estimatedMinutes} min
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
            {homework.title}
          </h1>

          {/* Barre de progression globale du devoir */}
          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">Progression</span>
              <span className="text-ink">{completedCount} / {totalCount}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-border/40 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                  background: progressPercentage === 100 ? 'var(--meadow)' : 'var(--sky)',
                }}
              />
            </div>
          </div>
        </header>

        {/* --- LISTE DES SOUS-TÂCHES --- */}
        <section className="animate-rise" style={{ animationDelay: '100ms' }}>
          <h2 className="font-display text-2xl text-ink mb-5 flex items-center gap-3">
            <span aria-hidden>📝</span> Tes missions pour ce devoir
          </h2>

          <div className="space-y-4">
            {homework.tasks.map((task) => {
              const isDone = task.status === 'completed';
              const isPostponed = task.status === 'postponed';

              return (
                <div
                  key={task.id}
                  onClick={() => !isDone && handleTaskAction(task.id, 'complete')}
                  className={`group flex items-start sm:items-center gap-4 p-5 rounded-2xl transition-all duration-300 border ${
                    isDone
                      ? 'bg-white/40 border-transparent opacity-75 cursor-default'
                      : 'bg-white/90 border-border/40 hover:border-border/80 shadow-sm cursor-pointer'
                  }`}
                >
                  {/* Case à cocher */}
                  <div
                    className={`mt-0.5 sm:mt-0 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
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

                  {/* Titre de la tâche */}
                  <div className="flex-1">
                    <div className={`text-[16px] transition-all duration-300 ${isDone ? 'line-through text-ink/40' : 'font-medium text-ink'}`}>
                      {task.title}
                    </div>
                    {isPostponed && (
                      <div className="text-sm mt-1 italic text-muted-foreground">
                        Reportée à plus tard
                      </div>
                    )}
                  </div>

                  {/* Action : Reporter */}
                  {!isDone && !isPostponed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskAction(task.id, 'postpone');
                      }}
                      className="flex-shrink-0 rounded-full border border-border/60 px-4 py-1.5 text-[13px] font-medium text-muted-foreground transition-all duration-300 hover:border-border hover:text-ink"
                    >
                      Plus tard
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* --- POSITIVE FEEDBACK (S'affiche quand 100% est atteint) --- */}
        {isAllDone && (
          <section className="animate-rise" style={{ animationDelay: '200ms' }}>
            <div className="paper-card p-8 text-center border-t-4" style={{ borderTopColor: 'var(--meadow)' }}>
              <div className="text-6xl mb-4 animate-bounce" style={{ animationIterationCount: 1 }}>🎉</div>
              <h3 className="font-display text-2xl text-ink mb-2">Incroyable !</h3>
              <p className="text-[15px] text-ink/80 font-medium">
                Tu as terminé toutes les missions de ce devoir. Beau travail d'équipe avec toi-même !
              </p>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}