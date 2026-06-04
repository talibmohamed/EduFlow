import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherDashboard() {
  const { user } = useAuth();

  // --- FAUSSES DONNÉES (Mocks) POUR L'EXEMPLE ---
  const myStudents = [
    { id: 1, name: 'Léo Martin', energyLabel: 'Au top', glyph: '⚡', completed: 5, total: 5 },
    { id: 2, name: 'Emma Dubois', energyLabel: 'En forme', glyph: '🙂', completed: 4, total: 5 },
    { id: 3, name: 'Hugo Leroy', energyLabel: 'Fatigué(e)', glyph: '😴', completed: 0, total: 1 },
  ];

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      <Header />
      
      <main className="mx-auto w-full max-w-5xl flex-1 p-6 lg:p-10 space-y-8">
        
        {/* En-tête du tableau de bord */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center animate-rise">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
              Espace Enseignant
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Bonjour {user.name} — Voici le résumé de ta classe aujourd'hui.
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
          
          <div className="p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              
              {myStudents.map((student) => {
                const progressPercentage = Math.round((student.completed / student.total) * 100) || 0;
                const isAllDone = student.completed === student.total && student.total > 0;

                return (
                  <div 
                    key={student.id} 
                    className="rounded-2xl border border-border/40 bg-white/60 p-6 shadow-sm transition-all hover:border-border/80 hover:shadow-md flex flex-col justify-between"
                  >
                    
                    {/* En-tête de la carte élève */}
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="font-display text-[19px] text-ink">{student.name}</h3>
                      <div 
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-white border border-border/40 shadow-sm cursor-help transition-transform hover:scale-110" 
                        title={student.energyLabel}
                      >
                        <span className="text-xl" aria-hidden>{student.glyph}</span>
                      </div>
                    </div>

                    {/* Progression */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Progression</span>
                        <span className="font-medium text-ink/80">{student.completed} / {student.total}</span>
                      </div>
                      
                      <div className="h-2.5 w-full rounded-full bg-border/30 overflow-hidden shadow-inner">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${progressPercentage}%`,
                            background: isAllDone ? 'var(--meadow)' : 'var(--sky)'
                          }}
                        />
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}