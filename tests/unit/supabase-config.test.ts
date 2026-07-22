import { expect, it } from 'vitest';
import { hasSupabaseConfiguration } from '../../src/lib/supabase/server';

it('requires both public Supabase values before creating a request client', () => {
  expect(hasSupabaseConfiguration({ url: '', publishableKey: 'key' })).toBe(false);
  expect(hasSupabaseConfiguration({ url: 'https://example.supabase.co', publishableKey: 'key' })).toBe(true);
});
