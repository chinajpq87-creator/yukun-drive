import type { APIRoute } from 'astro';
import { isAdmin } from '../../lib/auth';

const formString = (form: FormData, key: string) => String(form.get(key) ?? '').trim();
const redirectBack = (request: Request) => Response.redirect(request.headers.get('referer') ?? new URL('/admin', request.url), 303);

export const POST: APIRoute = async ({ request, locals }) => {
  const client = locals.supabase;
  if (!client) return new Response('Authentication is unavailable.', { status: 503 });
  const { data: { user } } = await client.auth.getUser();
  if (!isAdmin(user?.app_metadata)) return new Response('Forbidden', { status: 403 });

  const form = await request.formData();
  const action = formString(form, 'action');

  if (action === 'create-demand') {
    await client.from('market_demands').insert({ industry: formString(form, 'industry'), application: formString(form, 'application'), product_name: formString(form, 'productName'), customer_problem: formString(form, 'customerProblem') || null, motion_requirement: formString(form, 'motionRequirement') || null, market_priority: formString(form, 'priority') || 'medium' });
  }

  if (action === 'create-component') {
    let specification: Record<string, unknown> = {};
    try { specification = JSON.parse(formString(form, 'specification') || '{}'); } catch { return new Response('Specification must be valid JSON.', { status: 400 }); }
    await client.from('components').insert({ component_type: formString(form, 'componentType'), model: formString(form, 'model'), applications: formString(form, 'applications').split(',').map((item) => item.trim()).filter(Boolean), specification, is_public: form.get('isPublic') === 'true' });
  }

  if (action === 'create-solution') {
    await client.from('motion_solutions').insert({ market_id: formString(form, 'marketId'), solution_name: formString(form, 'solutionName'), slug: formString(form, 'slug'), application: formString(form, 'application'), motion_type: formString(form, 'motionType'), solution_description: formString(form, 'description') });
  }

  if (action === 'attach-component') {
    const { data: existingData } = await client.from('solution_components').select('sort_order').eq('solution_id', formString(form, 'solutionId')).order('sort_order', { ascending: false }).limit(1);
    const existing = existingData ?? [];
    await client.from('solution_components').insert({ solution_id: formString(form, 'solutionId'), component_id: formString(form, 'componentId'), component_role: formString(form, 'componentRole') || null, quantity: Number(formString(form, 'quantity') || 1), sort_order: (existing[0]?.sort_order ?? 0) + 1 });
  }

  if (action === 'update-inquiry') {
    await client.from('customer_inquiries').update({ status: formString(form, 'status'), admin_note: formString(form, 'adminNote') || null }).eq('id', formString(form, 'inquiryId'));
  }

  return redirectBack(request);
};
