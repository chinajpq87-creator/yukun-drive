import { expect, it } from 'vitest';
import { isAdmin } from '../../src/lib/auth';

it('permits only the admin application role', () => {
  expect(isAdmin({ role: 'admin' })).toBe(true);
  expect(isAdmin({ role: 'editor' })).toBe(false);
  expect(isAdmin(undefined)).toBe(false);
});
