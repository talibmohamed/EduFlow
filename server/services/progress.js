// Positive, never culpabilizing progress messages (cahier §4.7.2 / §4.7.3).
export function buildProgressMessage(completed, postponed) {
  if (completed > 0) {
    const plural = completed > 1 ? 's' : '';
    return `Tu as terminé ${completed} tâche${plural} aujourd'hui. Très bon effort.`;
  }
  if (postponed > 0) {
    return "Tu as avancé à ton rythme aujourd'hui. Chaque petite étape compte.";
  }
  return 'Ta progression apparaîtra ici lorsque tu commenceras une tâche.';
}
