import { z } from 'zod';

export const inquirySchema = z.object({
  solutionId: z.string().uuid(),
  customerName: z.string().trim().min(1).max(120),
  companyName: z.string().trim().max(160).optional(),
  country: z.string().trim().max(100).optional(),
  email: z.string().trim().email().max(254),
  application: z.string().trim().max(160).optional(),
  requirementDescription: z.string().trim().min(10).max(4000),
  requiredQuantity: z.coerce.number().int().positive().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
