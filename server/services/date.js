// "Today" is computed server-side from UTC (cahier: Définition du jour).
export function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}
