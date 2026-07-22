import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SupabaseConfig = {
  url: string | undefined;
  publishableKey: string | undefined;
};

type CookieContext = {
  cookies: {
    get(name: string): { value: string } | undefined;
    set(name: string, value: string, options?: Record<string, unknown>): void;
    delete(name: string, options?: Record<string, unknown>): void;
  };
};

export function hasSupabaseConfiguration(config: SupabaseConfig): boolean {
  return Boolean(config.url?.trim() && config.publishableKey?.trim());
}

export function createRequestClient(context: CookieContext): SupabaseClient | null {
  const config = {
    url: import.meta.env.PUBLIC_SUPABASE_URL,
    publishableKey: import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };

  if (!hasSupabaseConfiguration(config)) return null;

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      get: (name) => context.cookies.get(name)?.value,
      set: (name, value, options) => context.cookies.set(name, value, options),
      remove: (name, options) => context.cookies.delete(name, options),
    },
  });
}

export function createAdminClient(): SupabaseClient {
  const config = {
    url: import.meta.env.PUBLIC_SUPABASE_URL,
    publishableKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  if (!hasSupabaseConfiguration(config)) {
    throw new Error('Supabase server configuration is missing.');
  }

  return createClient(config.url, config.publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
