import { test } from 'node:test';
import assert from 'node:assert/strict';
import { todayUtc } from './date.js';

test('returns the current UTC day as YYYY-MM-DD', () => {
  const value = todayUtc();
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(value, new Date().toISOString().slice(0, 10));
});
