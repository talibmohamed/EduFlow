import { useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

// Les 3 niveaux d'énergie (clés alignées sur l'API : low / medium / high)
const energyLevels = [
  { key: 'low', glyph: '😴', label: 'Fatigué(e)', note: 'Une journée douce en perspective.' },
  { key: 'medium', glyph: '🙂', label: 'En forme', note: 'Le rythme parfait pour avancer.' },
  { key: 'high', glyph: '⚡', label: 'Au top', note: 'Prêt(e) à relever tous les défis !' },
];

// Les 3 niveaux de concentration (l'API attend energy_level ET focus_level)
const focusLevels = [
  { key: 'low', glyph: '🎈', label: 'Dans la lune', note: 'On choisit des missions toutes douces.' },
  { key: 'medium', glyph: '📘', label: 'Concentré(e)', note: 'De quoi bien avancer.' },
  { key: 'high', glyph: '🚀', label: 'Ultra focus', note: "Rien ne peut t'arrêter !" },
];

// Petit sélecteur d'emojis réutilisé pour l'énergie et la concentration (style d'origine conservé)
function EmojiLevelPicker({ levels, value, onSelect, groupLabel }) {
  return (
    <>
      <div className="flex items-center justify-center gap-6 sm:gap-12" role="radiogroup" aria-label={groupLabel}>
        {levels.map((level) => {
          const isActive = value === level.key;
          return (
            <button
              key={level.key}
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(level.key)}
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
      <p className="mt-6 text-[16px] font-medium text-ink/75 transition-all duration-300 min-h-[24px]">
        {levels.find((l) => l.key === value)?.label ?? 'Choisis ce qui te ressemble le plus.'}
      </p>
    </>
  );
}

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
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white" style={{ background: 'var(--linen)' }}>
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
          <section className="animate-rise">
            <h2 className="mb-6 font-display text-3xl sm:text-4xl text-ink leading-tight text-center sm:text-left">
              Comment te sens-tu aujourd'hui, <em className="not-italic" style={{ color: 'var(--sky)' }}>{user.name}</em> ?
            </h2>

            <div className="paper-card p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-10">
              <div>
                <h3 className="mb-5 font-display text-xl text-ink">Ton énergie</h3>
                <EmojiLevelPicker levels={energyLevels} value={energy} onSelect={setEnergy} groupLabel="Niveau d'énergie" />
              </div>

              <div>
                <h3 className="mb-5 font-display text-xl text-ink">Ta concentration</h3>
                <EmojiLevelPicker levels={focusLevels} value={focus} onSelect={setFocus} groupLabel="Niveau de concentration" />
              </div>

              <button
                onClick={submitDailyState}
                disabled={!energy || !focus || submitting}
                className="rounded-full px-8 py-3 text-[16px] font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                style={{ background: 'var(--sky)' }}
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
                  <div className="text-4xl sm:text-5xl" aria-hidden>{selectedEnergy?.glyph}</div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">{selectedEnergy?.label}</div>
                </div>
                <p className="max-w-xs text-[15px] font-medium text-ink/75">
                  Tes missions du jour sont adaptées à ton humeur. {selectedEnergy?.note}
                </p>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl" aria-hidden>{selectedFocus?.glyph}</div>
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
                  <div className="text-center text-[15px] font-medium text-muted-foreground py-8">
                    Aucune mission pour aujourd'hui. Profite de ta journée ! 🎉
                  </div>
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
                <div className="space-y-6">
                  {/* Message positif généré par le serveur */}
                  <div className="text-center text-lg font-medium" style={{ color: isAllDone ? 'var(--meadow)' : 'var(--ink)' }}>
                    {isAllDone
                      ? `Bravo ${user.name} ! Tu as terminé toutes tes missions pour aujourd'hui. 🎉`
                      : progress?.message ?? 'Touche une mission quand tu as terminé pour faire grandir la barre !'}
                  </div>

                  {/* Barre de progression visuelle */}
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

                  {/* Compteurs du jour (depuis l'API) */}
                  {progress && (progress.completed > 0 || progress.postponed > 0) && (
                    <div className="flex items-center justify-center gap-8 text-sm font-medium text-muted-foreground">
                      <span>✅ {progress.completed} terminée{progress.completed > 1 ? 's' : ''}</span>
                      <span>🕊️ {progress.postponed} reportée{progress.postponed > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
