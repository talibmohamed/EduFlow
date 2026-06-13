import { Link } from "react-router-dom"; // <-- Ajout de l'import Link
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Header from "../../components/Header";

// --- FAUSSES DONNÉES (Mocks) INTÉGRÉES POUR TESTER L'UI ---
const mockStats = {
  todayCompleted: 4,
  todayTotal: 5,
  weekCompleted: 18,
};

// Échelle : 1 (Bas/Doux) - 2 (Moyen) - 3 (Haut/Ultra)
const mockHistoryData = [
  { day: "Lun", energy: 2, focus: 1 },
  { day: "Mar", energy: 3, focus: 2 },
  { day: "Mer", energy: 3, focus: 3 },
  { day: "Jeu", energy: 1, focus: 2 },
  { day: "Ven", energy: 2, focus: 3 },
];

export default function ChildProgress() {
  return (
    <div className="min-h-screen bg-linen text-ink selection:bg-[var(--sky)] selection:text-white">
      <Header />
      
      <main className="mx-auto w-full max-w-4xl flex-1 p-6 lg:p-10 space-y-10 animate-rise">
        
        {/* --- BOUTON RETOUR --- */}
        <div className="mb-2">
          <Link 
            to="/child/dashboard" 
            className="inline-flex items-center gap-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-ink"
          >
            <span aria-hidden className="text-lg">←</span> Retour aux missions
          </Link>
        </div>

        {/* --- En-tête de la page --- */}
        <header className="text-center sm:text-left mt-0">
          <h1 className="font-display text-4xl sm:text-5xl text-ink mb-3 leading-tight">
            Ta progression <em className="not-italic" style={{ color: 'var(--meadow)' }}>héroïque</em> 🏆
          </h1>
          <p className="text-ink/85 leading-relaxed">
            Regarde tout ce que tu as accompli cette semaine ! Chaque petite étape compte.
          </p>
        </header>

        {/* --- Zone 1 : Les compteurs (Daily / Weekly Count) --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-rise" style={{ animationDelay: '100ms' }}>
          <div className="paper-card p-6 flex flex-col justify-center border-b-4" style={{ borderColor: 'var(--sky)' }}>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
              Aujourd'hui
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-sky/10 text-3xl" aria-hidden>
                🎯
              </div>
              <div>
                <div className="font-display text-4xl tabular-nums text-ink">
                  {mockStats.todayCompleted} <span className="text-2xl text-ink/40">/ {mockStats.todayTotal}</span>
                </div>
                <div className="text-ink/60 text-sm mt-1">missions réussies</div>
              </div>
            </div>
          </div>

          <div className="paper-card p-6 flex flex-col justify-center border-b-4" style={{ borderColor: 'var(--meadow)' }}>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
              Cette semaine
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-meadow/10 text-3xl" aria-hidden>
                ⭐
              </div>
              <div>
                <div className="font-display text-4xl tabular-nums text-ink">
                  {mockStats.weekCompleted}
                </div>
                <div className="text-ink/60 text-sm mt-1">missions au total</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Zone 2 : Graphique d'Énergie & Concentration --- */}
        <section className="paper-card p-6 sm:p-8 animate-rise" style={{ animationDelay: '200ms' }}>
          <div className="mb-8">
            <h2 className="font-display text-2xl text-ink">Ton rythme de la semaine</h2>
            <p className="text-ink/85 leading-relaxed mt-2">
              L'évolution de ton énergie (⚡) et de ta concentration (🚀) jour après jour.
            </p>
          </div>

          <div className="h-80 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHistoryData} margin={{ top: 10, right: 20, bottom: 10, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--ink)', opacity: 0.6, fontSize: 14 }} 
                  dy={10}
                />
                <YAxis 
                  domain={[0, 4]} 
                  ticks={[1, 2, 3]} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'var(--ink)', opacity: 0.6, fontSize: 14 }}
                  tickFormatter={(val) => {
                    if (val === 1) return 'Doux';
                    if (val === 2) return 'Moyen';
                    if (val === 3) return 'Haut';
                    return '';
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border)', 
                    boxShadow: 'var(--shadow-paper)' 
                  }}
                  labelStyle={{ fontWeight: 'bold', color: 'var(--ink)', marginBottom: '8px' }}
                  itemStyle={{ color: 'var(--ink)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', color: 'var(--ink)' }}/>
                
                {/* Ligne Énergie */}
                <Line 
                  name="Énergie"
                  type="monotone" 
                  dataKey="energy" 
                  stroke="var(--sky)" 
                  strokeWidth={4} 
                  dot={{ stroke: 'var(--sky)', strokeWidth: 2, r: 6, fill: 'var(--card)' }} 
                  activeDot={{ r: 8, fill: 'var(--sky)', stroke: 'none' }} 
                />
                
                {/* Ligne Concentration */}
                <Line 
                  name="Concentration"
                  type="monotone" 
                  dataKey="focus" 
                  stroke="var(--meadow)" 
                  strokeWidth={4} 
                  dot={{ stroke: 'var(--meadow)', strokeWidth: 2, r: 6, fill: 'var(--card)' }} 
                  activeDot={{ r: 8, fill: 'var(--meadow)', stroke: 'none' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

      </main>
    </div>
  );
}