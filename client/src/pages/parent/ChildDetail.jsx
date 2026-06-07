import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Header from '../../components/Header';
import { EmptyState } from '../../components/ui';
import api from '../../lib/api';

const LEVEL_VALUE = { low: 1, medium: 2, high: 3 };
const LEVEL_LABEL = { 1: 'Faible', 2: 'Moyen', 3: 'Élevé' };
const ENERGY_COLOR = 'var(--sky)';
const FOCUS_COLOR = '#f59e0b';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

export default function ChildDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [child, setChild] = useState(null);
  const [dailyStates, setDailyStates] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [childrenRes, statesRes, progressRes] = await Promise.all([
          api.get('/api/parent/children'),
          api.get(`/api/parent/children/${id}/daily-states`),
          api.get(`/api/parent/children/${id}/progress`),
        ]);

        const found = childrenRes.data.data.children.find(
          (c) => String(c.id) === String(id),
        );
        if (!found) {
          setError('Enfant introuvable.');
          return;
        }
        setChild(found);
        setDailyStates(statesRes.data.data.dailyStates);
        setProgress(progressRes.data.data);
      } catch {
        setError('Impossible de charger les données. Réessaie dans un instant.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);


  const chartData = [...dailyStates]
    .reverse()
    .map((s) => ({
      date: formatDate(s.date),
      Énergie: LEVEL_VALUE[s.energy_level] ?? null,
      Concentration: LEVEL_VALUE[s.focus_level] ?? null,
    }));

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: 'var(--linen)' }}>
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 p-6 lg:p-10">
          <div className="paper-card p-10 text-center text-[15px] font-medium text-muted-foreground animate-pulse">
            Chargement...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: 'var(--linen)' }}>
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 p-6 lg:p-10">
          <div className="paper-card p-6 text-center text-[15px] font-medium text-ink" role="alert">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--sky)] selection:text-white"
      style={{ background: 'var(--linen)' }}>
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 p-6 lg:p-10 space-y-8">

        {/* En-tête */}
        <div className="animate-rise">
          <button
            onClick={() => navigate('/parent/dashboard')}
            className="mb-4 text-sm text-muted-foreground hover:text-ink transition-colors"
          >
            ← Retour
          </button>
          <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
            {child.name}
          </h1>
          {(child.age || child.classLevel) && (
            <p className="mt-2 text-[15px] text-muted-foreground">
              {[child.age ? `${child.age} ans` : null, child.classLevel]
                .filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        {/* Progression du jour */}
        {progress && (
          <div className="paper-card p-6 space-y-3 animate-rise" style={{ animationDelay: '80ms' }}>
            <h2 className="font-display text-xl text-ink">Aujourd'hui</h2>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-ink">{progress.today.completed}</span>
                <span className="text-sm text-muted-foreground">tâche{progress.today.completed !== 1 ? 's' : ''} terminée{progress.today.completed !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-ink">{progress.today.postponed}</span>
                <span className="text-sm text-muted-foreground">reportée{progress.today.postponed !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {/* Graphique énergie / concentration */}
        <div className="paper-card p-6 space-y-4 animate-rise" style={{ animationDelay: '160ms' }}>
          <h2 className="font-display text-xl text-ink">Énergie & Concentration (30 derniers jours)</h2>

          {chartData.length === 0 ? (
            <EmptyState
              emoji="📊"
              title="Aucune donnée pour le moment"
              description="Les niveaux d'énergie et de concentration apparaîtront ici dès que ton enfant commencera à les enregistrer."
            />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[1, 3]}
                  ticks={[1, 2, 3]}
                  tickFormatter={(v) => LEVEL_LABEL[v]}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value) => LEVEL_LABEL[value]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'white',
                    fontSize: '13px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="Énergie"
                  stroke={ENERGY_COLOR}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: ENERGY_COLOR }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Concentration"
                  stroke={FOCUS_COLOR}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: FOCUS_COLOR }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </main>
    </div>
  );
}