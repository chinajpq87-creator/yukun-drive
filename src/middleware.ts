import { defineMiddleware } from 'astro:middleware';
import { isAdmin } from './lib/auth';
import { createRequestClient } from './lib/supabase/server';

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createRequestClient(context);
  context.locals.supabase = supabase;

  if (!context.url.pathname.startsWith('/admin') || context.url.pathname === '/admin/login') {
    return next();
  }

  if (!supabase) return context.redirect('/admin/login');

  const { data: { user } } = await supabase.auth.getUser();
  return isAdmin(user?.app_metadata) ? next() : context.redirect('/admin/login');
});
