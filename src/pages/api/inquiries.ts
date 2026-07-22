import type { APIRoute } from 'astro';
import { createAdminClient } from '../../lib/supabase/server';
import { submitInquiry } from '../../services/inquiries';
import { inquirySchema } from '../../validation/inquiry';

export const POST: APIRoute = async ({ request }) => {
  const payload = inquirySchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return new Response(JSON.stringify({ ok: false, code: 'INVALID_INPUT' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const result = await submitInquiry(createAdminClient(), payload.data);
    return new Response(JSON.stringify(result), {
      status: result.ok ? 201 : result.code === 'SOLUTION_NOT_FOUND' ? 404 : 500,
      headers: { 'content-type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, code: 'SERVICE_UNAVAILABLE' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }
};
