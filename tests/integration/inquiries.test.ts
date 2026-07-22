import { expect, it } from 'vitest';
import { submitInquiry } from '../../src/services/inquiries';

it('rejects an inquiry for a solution that is not published', async () => {
  const client = {
    from: () => ({
      select: () => ({
        eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }),
      }),
    }),
  };

  await expect(submitInquiry(client, {
    solutionId: 'c0a80121-0000-4000-8000-000000000002',
    customerName: 'Ada Lovelace',
    email: 'ada@example.com',
    requirementDescription: 'Need a compact lock actuator for a pilot run.',
  })).resolves.toEqual({ ok: false, code: 'SOLUTION_NOT_FOUND' });
});
