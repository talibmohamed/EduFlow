import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <-- Ajout de l'import Link
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyState, EnergyPicker } from '../../components/ui';
import api from '../../lib/api';

// Les 3 niveaux d'énergie (clés alignées sur l'API : low / medium / high)
const energyLevels = [
  { key: 'low', emoji: '😴', label: 'Fatigué(e)', note: 'Une journée douce en perspective.' },
  { key: 'medium', emoji: '🙂', label: 'En forme', note: 'Le rythme parfait pour avancer.' },
  { key: 'high', emoji: '⚡', label: 'Au top', note: 'Prêt(e) à relever tous les défis !' },
];

// Les 3 niveaux de concentration (l'API attend energy_level ET focus_level)
const focusLevels = [
  { key: 'low', emoji: '🎈', label: 'Dans la lune', note: 'On choisit des missions toutes douces.' },
  { key: 'medium', emoji: '📘', label: 'Concentré(e)', note: 'De quoi bien avancer.' },
  { key: 'high', emoji: '🚀', label: 'Ultra focus', note: "Rien ne peut t'arrêter !" },
];

export default function ChildDashboard() {
  const { user } = useAuth();

  // États de la page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyState, setDailyState] = useState(null); // null = pas encore posé aujourd'hui (empty state)
  const [energy, setEnergy] = useState(null); // choix du formulaire avant envoi
  const [focus, setFocus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [homework, setHomework] = useState([]); // devoirs adaptés (avec leurs tâches)
  const [progress, setProgress] = useState(null); // { completed, postponed, message } depuis l'API
  const [pendingTaskId, setPendingTaskId] = useState(null); // tâche en cours d'envoi (anti double-clic)

  // Charge les devoirs adaptés + la progression du jour
  const loadDayData = useCallback(async () => {
    const [homeworkRes, progressRes] = await Promise.all([
      api.get('/api/child/adapted-homework'),
      api.get('/api/child/progress'),
    ]);
    setHomework(homeworkRes.data.data.homework);
    setProgress(progressRes.data.data);
  }, []);

  // Au chargement : l'enfant a-t-il déjà donné son état du jour ?
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const res = await api.get('/api/daily-state/me');
        const state = res.data.data.dailyState;
        if (cancelled) return;
        setDailyState(state);
        if (state) {
          await loadDayData();
        }
      } catch {
        if (!cancelled) setError("Impossible de charger ta journée. Vérifie ta connexion puis réessaie.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [loadDayData]);

  // Envoi de l'état du jour (immuable côté serveur : une seule fois par jour)
  const submitDailyState = async () => {
    if (!energy || !focus || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      // L'API attend du snake_case en requête (et répond en camelCase)
      const res = await api.post('/api/daily-state', { energy_level: energy, focus_level: focus });
      setDailyState(res.data.data.dailyState);
      await loadDayData();
    } catch (err) {
      if (err.response?.status === 409) {
        // Déjà posé aujourd'hui (autre onglet ?) : on récupère l'état existant
        const res = await api.get('/api/daily-state/me');
        setDailyState(res.data.data.dailyState);
        await loadDayData();
      } else {
        setError("Oups, ton humeur n'a pas pu être enregistrée. Réessaie dans un instant.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Marque une tâche comme faite ou reportée, puis rafraîchit la progression
  const recordTask = async (taskId, action) => {
    if (pendingTaskId) return;
    setPendingTaskId(taskId);
    try {
      const res = await api.patch(`/api/tasks/${taskId}/${action}`);
      const updated = res.data.data.task;
      setHomework((prev) =>
        prev.map((hw) => ({
          ...hw,
          tasks: hw.tasks.map((t) => (t.id === updated.id ? { ...t, status: updated.status } : t)),
        })),
      );
      const progressRes = await api.get('/api/child/progress');
      setProgress(progressRes.data.data);
    } catch {
      setError("Oups, ta mission n'a pas pu être mise à jour. Réessaie dans un instant.");
    } finally {
      setPendingTaskId(null);
    }
  };

  // Liste à plat des missions du jour (toutes les tâches des devoirs adaptés)
  const missions = homework.flatMap((hw) =>
    hw.tasks.map((task) => ({
      ...task,
      homeworkTitle: hw.title,
      subject: hw.subject,
      estimatedMinutes: hw.estimatedMinutes,
    })),
  );
  const completedCount = missions.filter((m) => m.status === 'completed').length;
  const progressPercentage = missions.length > 0 ? Math.round((completedCount / missions.length) * 100) : 0;
  const isAllDone = missions.length > 0 && completedCount === missions.length;

  const selectedEnergy = dailyState && energyLevels.find((l) => l.key === dailyState.energyLevel);
  const selectedFocus = dailyState && focusLevels.find((l) => l.key === dailyState.focusLevel);

  return (
    <div className="flex min-h-screen flex-col bg-linen text-ink selection:bg-[var(--sky)] selection:text-white">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 p-6 lg:p-10 space-y-12">

        {error && (
          <div className="paper-card p-4 text-center text-[15px] font-medium" style={{ color: 'var(--ink)' }} role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="paper-card p-10 text-center text-[15px] font-medium text-muted-foreground animate-pulse">
            On prépare ta journée...
          </div>
        ) : !dailyState ? (
          /* --- Empty state : le formulaire de l'état du jour --- */
          <section className="relative">
            {/* Dawn gradient (matches Hero) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-16 bottom-0 -z-10"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, transparent 40%, oklch(0.93 0.04 240 / 0.35) 100%)',
              }}
            />

            <h2 className="mb-2 font-display text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.05] text-center">
              <span className="inline-block animate-breath mr-[0.28em]" style={{ animationDelay: '0ms' }}>
                Comment
              </span>
              <span className="inline-block animate-breath mr-[0.28em]" style={{ animationDelay: '220ms' }}>
                te
              </span>
              <span className="inline-block animate-breath mr-[0.28em]" style={{ animationDelay: '440ms' }}>
                sens-tu
              </span>
              <span className="inline-block animate-breath mr-[0.28em]" style={{ animationDelay: '660ms' }}>
                <span className="swash">
                  aujourd'hui
                  <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
                    <path
                      className="swash-path"
                      d="M3 9 C 50 3 90 12 140 6 S 196 4 197 7"
                      fill="none"
                      stroke="var(--honey)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      pathLength="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
                ,
              </span>
              <span className="inline-block animate-breath" style={{ animationDelay: '880ms' }}>
                <em className="not-italic" style={{ color: 'var(--sky)' }}>{user.name}</em>
                {' ?'}
              </span>
            </h2>
            <p className="mb-10 text-center text-sm text-muted-foreground animate-rise" style={{ animationDelay: '1100ms' }}>
              Touche celle qui te ressemble le plus.
            </p>

            <div className="paper-card p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-10 animate-rise" style={{ animationDelay: '1200ms' }}>
              <div>
                <EnergyPicker
                  heading="Ton énergie"
                  choices={energyLevels}
                  value={energy}
                  onChange={setEnergy}
                />
                <p className="mt-4 text-[15px] font-medium text-ink/75 min-h-[24px]">
                  {energyLevels.find((l) => l.key === energy)?.note ?? 'Choisis ce qui te ressemble le plus.'}
                </p>
              </div>

              <div>
                <EnergyPicker
                  heading="Ta concentration"
                  choices={focusLevels}
                  value={focus}
                  onChange={setFocus}
                />
                <p className="mt-4 text-[15px] font-medium text-ink/75 min-h-[24px]">
                  {focusLevels.find((l) => l.key === focus)?.note ?? 'Choisis ce qui te ressemble le plus.'}
                </p>
              </div>

              <button
                onClick={submitDailyState}
                disabled={!energy || !focus || submitting}
                className="btn-paper btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'On prépare tes missions...' : "C'est parti !"}
              </button>
            </div>
          </section>
        ) : (
          /* --- Filled state : récap du jour + missions adaptées + progression --- */
          <>
            <section className="animate-rise">
              <h2 className="mb-6 font-display text-3xl sm:text-4xl text-ink leading-tight text-center sm:text-left">
                Bonjour <em className="not-italic" style={{ color: 'var(--sky)' }}>{user.name}</em> !
              </h2>
              <div className="paper-card p-6 sm:p-8 flex items-center justify-center gap-8 sm:gap-14">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl" aria-hidden>{selectedEnergy?.emoji}</div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">{selectedEnergy?.label}</div>
                </div>
                <p className="max-w-xs text-[15px] font-medium text-ink/75">
                  Tes missions du jour sont adaptées à ton humeur. {selectedEnergy?.note}
                </p>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl" aria-hidden>{selectedFocus?.emoji}</div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">{selectedFocus?.label}</div>
                </div>
              </div>
            </section>

            {/* --- Zone 2: Missions adaptées --- */}
            <section className="animate-rise" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-3">
                  <span aria-hidden className="text-[1.2em]">📝</span>
                  Tes missions du jour
                </h2>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {completedCount} / {missions.length}
                </span>
              </div>

              <div className="paper-card p-4 sm:p-6">
                {missions.length === 0 ? (
                  <EmptyState
                    emoji="🎉"
                    title="Aucune mission pour aujourd'hui"
                    description="Profite de ta journée — tu l'as méritée."
                  />
                ) : (
                  <ul className="space-y-3">
                    {missions.map((mission) => {
                      const isDone = mission.status === 'completed';
                      const isPostponed = mission.status === 'postponed';
                      const isPending = pendingTaskId === mission.id;

                      return (
                        <li
                          key={mission.id}
                          onClick={() => !isDone && !isPending && recordTask(mission.id, 'complete')}
                          className={`group flex items-start gap-4 p-4 rounded-xl transition-all duration-300 border ${
                            isDone
                              ? 'bg-white/40 border-transparent opacity-75 cursor-default'
                              : 'bg-white/80 border-border/40 hover:border-border/80 shadow-sm cursor-pointer'
                          } ${isPending ? 'opacity-60' : ''}`}
                        >
                          {/* Case à cocher personnalisée */}
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

                          {/* Texte de la mission */}
                          <div className="flex-1">
                            <div className={`text-[15px] transition-all duration-300 ${isDone ? 'line-through text-ink/40' : 'font-medium text-ink'}`}>
                              {mission.title}
                            </div>
                            <div className={`text-sm mt-0.5 transition-all duration-300 ${isDone ? 'text-ink/30' : 'text-muted-foreground'}`}>
                              {mission.homeworkTitle} · {mission.subject}
                              {isPostponed && <span className="ml-2 italic text-muted-foreground">Reportée</span>}
                            </div>
                          </div>

                          {/* Reporter la mission (sans culpabiliser) */}
                          {!isDone && !isPostponed && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isPending) recordTask(mission.id, 'postpone');
                              }}
                              className="self-center rounded-full border border-border/60 px-3 py-1 text-[13px] font-medium text-muted-foreground transition-all duration-300 hover:border-border hover:text-ink"
                            >
                              Plus tard
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>

{/* --- Zone 3: Progression positive --- */}
            <section className="animate-rise" style={{ animationDelay: '200ms' }}>
              <h2 className="mb-5 font-display text-2xl sm:text-3xl text-ink flex items-center gap-3">
                <span aria-hidden className="text-[1.2em]">🌱</span>
                Ta progression
              </h2>
              <div className="paper-card p-6 sm:p-8 border-t-4 shadow-sm transition-all duration-500" style={{ borderTopColor: isAllDone ? 'var(--meadow)' : 'var(--clay)' }}>
                
                {/* Condition : État vide ou Barre de progression */}
                {(!progress || (progress.completed === 0 && progress.postponed === 0)) ? (
                  <EmptyState
                    emoji="🌱"
                    title="Ta progression apparaîtra ici"
                    description="Lorsque tu commenceras une mission, tu verras tout grandir."
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="text-center text-lg font-medium" style={{ color: isAllDone ? 'var(--meadow)' : 'var(--ink)' }}>
                      {isAllDone
                        ? `Bravo ${user.name} ! Tu as terminé toutes tes missions pour aujourd'hui. 🎉`
                        : progress?.message ?? 'Continue à ton rythme.'}
                    </div>

                    {missions.length > 0 && (
                      <div className="h-3 w-full rounded-full bg-white/60 overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${progressPercentage}%`,
                            background: 'var(--meadow)',
                          }}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-8 text-sm font-medium text-muted-foreground mt-6">
                      <span>✅ {progress.completed} terminée{progress.completed > 1 ? 's' : ''}</span>
                      <span>🕊️ {progress.postponed} reportée{progress.postponed > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                )}

                {/* --- LE BOUTON EST MAINTENANT ICI : TOUJOURS VISIBLE --- */}
                <div className="pt-6 mt-6 flex justify-center border-t border-border/40">
                  <Link 
                    to="/child/progress" 
                    className="btn-paper btn-ghost text-[15px] flex items-center gap-2 transition-transform hover:scale-105"
                    style={{ color: 'var(--sky)' }}
                  >
                    <span aria-hidden className="text-lg">🏆</span> Voir mon historique de la semaine
                  </Link>
                </div>

              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}