import { z } from 'zod';

export const saveDraftSchema = z.object({
  fullName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  aadhaarNumber: z.string().nullable().optional(),
  panNumber: z.string().nullable().optional(),
  aadhaarUrl: z.string().nullable().optional(),
  panUrl: z.string().nullable().optional(),
});

export const submitKycSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date of birth'),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits').nullable().optional().or(z.literal('')),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').nullable().optional().or(z.literal('')),
  aadhaarUrl: z.string().url('Invalid Aadhaar document URL').nullable().optional().or(z.literal('')),
  panUrl: z.string().url('Invalid PAN document URL').nullable().optional().or(z.literal('')),
}).refine(data => {
  const hasAadhaar = !!(data.aadhaarNumber && data.aadhaarUrl);
  const hasPan = !!(data.panNumber && data.panUrl);
  return hasAadhaar || hasPan;
}, {
  message: 'Either Aadhaar (Number & Document) or PAN (Number & Document) must be provided',
  path: ['aadhaarNumber']
});

export type SaveDraftInput = z.infer<typeof saveDraftSchema>;
export type SubmitKycInput = z.infer<typeof submitKycSchema>;
