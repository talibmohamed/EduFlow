import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adaptWorkload } from './adapt.js';

const hw = (id, priority, dueDate) => ({ id, priority, dueDate });

test('low energy shows only the single highest-priority homework', () => {
  const list = [hw(1, 1, '2026-06-10'), hw(2, 3, '2026-06-20'), hw(3, 2, '2026-06-15')];
  const result = adaptWorkload(list, { energyLevel: 'low', focusLevel: 'high' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 2);
});

test('low focus also caps to one homework', () => {
  const list = [hw(1, 1, '2026-06-10'), hw(2, 2, '2026-06-12')];
  const result = adaptWorkload(list, { energyLevel: 'high', focusLevel: 'low' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 2);
});

test('medium energy shows up to three homework, highest priority first', () => {
  const list = [hw(1, 1, '2026-06-10'), hw(2, 2, '2026-06-11'), hw(3, 3, '2026-06-12'), hw(4, 4, '2026-06-13')];
  const result = adaptWorkload(list, { energyLevel: 'medium', focusLevel: 'high' });
  assert.deepEqual(result.map((h) => h.id), [4, 3, 2]);
});

test('high energy and focus shows the full list', () => {
  const list = [hw(1, 1, '2026-06-10'), hw(2, 2, '2026-06-11'), hw(3, 3, '2026-06-12')];
  const result = adaptWorkload(list, { energyLevel: 'high', focusLevel: 'high' });
  assert.deepEqual(result.map((h) => h.id), [3, 2, 1]);
});

test('sorts by priority desc then earliest due date', () => {
  const list = [hw(1, 2, '2026-06-20'), hw(2, 2, '2026-06-10'), hw(3, 5, '2026-06-30')];
  const result = adaptWorkload(list, { energyLevel: 'high', focusLevel: 'high' });
  assert.deepEqual(result.map((h) => h.id), [3, 2, 1]);
});

test('does not mutate the input list', () => {
  const list = [hw(1, 1, '2026-06-10'), hw(2, 2, '2026-06-11')];
  const copy = [...list];
  adaptWorkload(list, { energyLevel: 'high', focusLevel: 'high' });
  assert.deepEqual(list, copy);
});

test('returns an empty array when there is no homework', () => {
  assert.deepEqual(adaptWorkload([], { energyLevel: 'low', focusLevel: 'low' }), []);
});
