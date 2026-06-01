import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildProgressMessage } from './progress.js';

test('celebrates completed tasks with correct pluralization', () => {
  assert.equal(buildProgressMessage(1, 0), "Tu as terminé 1 tâche aujourd'hui. Très bon effort.");
  assert.equal(buildProgressMessage(2, 1), "Tu as terminé 2 tâches aujourd'hui. Très bon effort.");
});

test('acknowledges postponed-only days without guilt', () => {
  assert.equal(
    buildProgressMessage(0, 2),
    "Tu as avancé à ton rythme aujourd'hui. Chaque petite étape compte.",
  );
});

test('shows a neutral empty-state message when nothing happened', () => {
  assert.equal(
    buildProgressMessage(0, 0),
    'Ta progression apparaîtra ici lorsque tu commenceras une tâche.',
  );
});
