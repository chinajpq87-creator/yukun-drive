import { describe, expect, it } from 'vitest';
import { inquirySchema } from '../../src/validation/inquiry';

describe('inquirySchema', () => {
  const validInquiry = {
    solutionId: 'c0a80121-0000-4000-8000-000000000001',
    customerName: 'Ada Lovelace',
    email: 'ada@example.com',
    requirementDescription: 'Need a compact lock actuator for a pilot run.',
    requiredQuantity: 100,
  };

  it('accepts a complete inquiry with a positive quantity', () => {
    expect(inquirySchema.parse(validInquiry).requiredQuantity).toBe(100);
  });

  it('rejects a non-positive quantity', () => {
    expect(() => inquirySchema.parse({ ...validInquiry, requiredQuantity: 0 })).toThrow();
  });
});
