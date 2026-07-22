import type { InquiryInput } from '../validation/inquiry';

export type InquiryResult =
  | { ok: true }
  | { ok: false; code: 'SOLUTION_NOT_FOUND' | 'WRITE_FAILED' };

export async function submitInquiry(client: any, input: InquiryInput): Promise<InquiryResult> {
  const { data: solution } = await client
    .from('motion_solutions')
    .select('id')
    .eq('id', input.solutionId)
    .eq('status', 'published')
    .maybeSingle();

  if (!solution) return { ok: false, code: 'SOLUTION_NOT_FOUND' };

  const { error } = await client.from('customer_inquiries').insert({
    solution_id: input.solutionId,
    customer_name: input.customerName,
    company_name: input.companyName ?? null,
    country: input.country ?? null,
    email: input.email,
    application: input.application ?? null,
    requirement_description: input.requirementDescription,
    required_quantity: input.requiredQuantity ?? null,
    status: 'new',
  });

  return error ? { ok: false, code: 'WRITE_FAILED' } : { ok: true };
}
