import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../lib/api';

const DIFFICULTY_LABEL = { easy: 'Facile', medium: 'Moyenne', hard: 'Difficile' };
const DIFFICULTY_COLOR = { easy: 'var(--meadow)', medium: 'var(--sky)', hard: '#f87171' };

function CountCard({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-white/60 p-6 shadow-sm flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="font-display text-4xl" style={{ color }}>
        {value}
      </span>
      <span className="text-xs text-muted-foreground">7 derniers jours</span>
    </div>
  );
}

export default function TeacherReports() {
  const { childId } = useParams();
  const [data, setData] = useState(null);
  const [childName, setChildName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const reportRes = await api.get(`/api/teacher/reports/${childId}`);
        setData(reportRes.data.data);
        setChildName(reportRes.data.data.child.name);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Cet élève n'est pas assigné à votre classe.");
        } else {
          setError('Impossible de charger le rapport.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [childId]);

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 p-6 lg:p-10 space-y-8">

        <div className="animate-rise">
          <Link
            to="/teacher/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-ink transition-colors flex items-center gap-2 mb-6"
          >
            ← Retour au tableau de bord
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
            Rapport de <em className="not-italic" style={{ color: 'var(--meadow)' }}>{childName || '…'}</em>
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Activité sur les 7 derniers jours.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && !error && (
          <p className="text-muted-foreground text-sm">Chargement…</p>
        )}

        {data && (
          <>
            {/* Count cards */}
            <div className="grid grid-cols-2 gap-6 animate-rise" style={{ animationDelay: '100ms' }}>
              <CountCard
                label="Tâches complétées"
                value={data.totals.completed}
                color="var(--meadow)"
              />
              <CountCard
                label="Tâches reportées"
                value={data.totals.postponed}
                color="#f87171"
              />
            </div>

            {/* Daily breakdown */}
            {data.daily.length > 0 && (
              <div className="paper-card animate-rise" style={{ animationDelay: '150ms' }}>
                <div className="border-b border-border/40 p-6 sm:p-8">
                  <h2 className="font-display text-xl text-ink">Détail par jour</h2>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="divide-y divide-border/30">
                    {data.daily.map((day) => (
                      <div key={day.date} className="flex items-center justify-between py-3 text-sm">
                        <span className="text-muted-foreground">{day.date}</span>
                        <div className="flex gap-4">
                          <span className="text-green-600 font-medium">{day.completed} complétée{day.completed !== 1 ? 's' : ''}</span>
                          <span className="text-red-400 font-medium">{day.postponed} reportée{day.postponed !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Homework list */}
            <div className="paper-card animate-rise" style={{ animationDelay: '200ms' }}>
              <div className="border-b border-border/40 p-6 sm:p-8">
                <h2 className="font-display text-xl text-ink">Devoirs assignés</h2>
              </div>

              <div className="p-6 sm:p-8">
                {data.homework.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucun devoir assigné pour le moment.</p>
                ) : (
                  <div className="divide-y divide-border/30">
                    {data.homework.map((hw) => {
                      const pct = hw.totalTasks > 0 ? Math.round((hw.completedTasks / hw.totalTasks) * 100) : 0;
                      const done = hw.completedTasks === hw.totalTasks && hw.totalTasks > 0;
                      return (
                        <div key={hw.id} className="py-5 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-ink">{hw.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {hw.subject} · dû le {hw.dueDate}
                              </p>
                            </div>
                            <span
                              className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full text-white"
                              style={{ background: DIFFICULTY_COLOR[hw.difficulty] }}
                            >
                              {DIFFICULTY_LABEL[hw.difficulty]}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Progression</span>
                              <span>{hw.completedTasks} / {hw.totalTasks} tâches</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-border/30 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${pct}%`,
                                  background: done ? 'var(--meadow)' : 'var(--sky)',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}
