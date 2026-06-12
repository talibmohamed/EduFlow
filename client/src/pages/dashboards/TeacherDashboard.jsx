import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyState, HomeworkCard } from '../../components/ui';
import api from '../../lib/api';

const DIFFICULTY_LABEL_FR = { easy: 'Facile', medium: 'Moyenne', hard: 'Difficile' };

function ChildCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/40 bg-white/60 p-6 shadow-sm animate-pulse flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-5 w-28 rounded-full bg-clay" />
          <div className="h-3 w-16 rounded-full bg-clay" />
        </div>
        <div className="h-5 w-12 rounded-full bg-clay" />
      </div>
      <div className="h-3 w-24 rounded-full bg-clay" />
    </div>
  );
}

function HomeworkCardSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-3 w-20 rounded-full bg-clay animate-pulse" />
      <div className="hw-card animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 rounded-full bg-clay" />
          <div className="h-3 w-12 rounded-full bg-clay" />
        </div>
        <div className="mt-4 h-5 w-3/4 rounded-full bg-clay" />
        <div className="mt-4 h-3 w-1/2 rounded-full bg-clay" />
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [childrenRes, homeworkRes] = await Promise.all([
          api.get('/api/teacher/children'),
          api.get('/api/teacher/homework'),
        ]);
        setChildren(childrenRes.data.data.children);
        setHomework(homeworkRes.data.data.homework);
      } catch {
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 p-6 lg:p-10 space-y-8">

        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center animate-rise">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
              Espace Enseignant
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Bonjour {user.name} — Voici le résumé de ta classe aujourd'hui.
            </p>
          </div>

          <Link to="/teacher/homework/create" className="btn-paper btn-primary flex-shrink-0">
            + Créer un nouveau devoir
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-border bg-clay p-4 text-sm text-ink">
            {error}
          </div>
        )}

        {/* Children list */}
        <div className="paper-card animate-rise" style={{ animationDelay: '100ms' }}>
          <div className="border-b border-border/40 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Mes élèves assignés</h2>
          </div>

          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => <ChildCardSkeleton key={i} />)}
              </div>
            ) : children.length === 0 ? (
              <EmptyState
                emoji="🌿"
                title="Aucun élève assigné"
                description="Tes élèves apparaîtront ici dès qu'ils seront ajoutés à ta classe."
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    to={`/teacher/reports/${child.id}`}
                    className="rounded-2xl border border-border/40 bg-white/60 p-6 shadow-sm transition-all hover:border-border/80 hover:shadow-md flex flex-col justify-between no-underline"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-[19px] text-ink">{child.name}</h3>
                        {child.class_level && (
                          <p className="text-sm text-muted-foreground mt-0.5">{child.class_level}</p>
                        )}
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-border/20 text-muted-foreground">
                        {child.age ? `${child.age} ans` : '—'}
                      </span>
                    </div>
                    <span className="text-xs text-sky-600 font-medium">Voir le rapport →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent homework */}
        <div className="paper-card animate-rise" style={{ animationDelay: '200ms' }}>
          <div className="border-b border-border/40 p-6 sm:p-8 flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">Devoirs récents</h2>
          </div>

          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => <HomeworkCardSkeleton key={i} />)}
              </div>
            ) : homework.length === 0 ? (
              <EmptyState
                emoji="✏️"
                title="Aucun devoir créé"
                description="Crée ton premier devoir depuis le bouton en haut. Il sera découpé en petites étapes."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {homework.slice(0, 6).map((hw) => (
                  <div key={hw.id} className="space-y-2">
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Pour {hw.child.name}
                    </div>
                    <HomeworkCard
                      title={hw.title}
                      subject={hw.subject}
                      minutes={hw.estimatedMinutes}
                      dueLabel={`dû le ${hw.dueDate}`}
                      difficulty={hw.difficulty}
                      difficultyLabel={DIFFICULTY_LABEL_FR[hw.difficulty]}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
