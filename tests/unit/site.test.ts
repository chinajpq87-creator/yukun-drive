import { expect, it } from 'vitest';
import { getContactEmail } from '../../src/config/site';

it('uses the configured product-and-solution contact address', () => {
  expect(getContactEmail('chinajpq@outlook.com')).toBe('chinajpq@outlook.com');
});

it('falls back to the approved contact address when configuration is absent', () => {
  expect(getContactEmail(undefined)).toBe('chinajpq@outlook.com');
});
