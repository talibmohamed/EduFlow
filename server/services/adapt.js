// Pure workload-adaptation algorithm (cahier §4.5).
// difficulty is intentionally NOT used: adaptation relies only on
// energy, focus, priority and due date.
export function adaptWorkload(homeworkList, dailyState) {
  const { energyLevel, focusLevel } = dailyState;

  let maxHomework;
  if (energyLevel === 'low' || focusLevel === 'low') {
    maxHomework = 1;
  } else if (energyLevel === 'medium' || focusLevel === 'medium') {
    maxHomework = 3;
  } else {
    maxHomework = homeworkList.length;
  }

  return [...homeworkList]
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, maxHomework);
}
