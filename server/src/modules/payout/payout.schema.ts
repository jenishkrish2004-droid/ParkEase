import { z } from 'zod';

export const savePayoutSchema = z.object({
  accountHolderName: z.string().min(2, 'Account holder name is required'),
  payoutMethod: z.enum(['BANK', 'UPI']),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  confirmAccountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.string().optional(),
}).refine(data => {
  if (data.payoutMethod === 'BANK') {
    return !!data.bankName && !!data.accountNumber && !!data.ifscCode && !!data.confirmAccountNumber;
  }
  return true;
}, {
  message: 'All bank details are required for BANK method',
  path: ['bankName']
}).refine(data => {
  if (data.payoutMethod === 'BANK') {
    return data.accountNumber === data.confirmAccountNumber;
  }
  return true;
}, {
  message: 'Account numbers do not match',
  path: ['confirmAccountNumber']
}).refine(data => {
  if (data.payoutMethod === 'BANK' && data.ifscCode) {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode);
  }
  return true;
}, {
  message: 'Invalid IFSC code format',
  path: ['ifscCode']
}).refine(data => {
  if (data.payoutMethod === 'UPI') {
    return !!data.upiId;
  }
  return true;
}, {
  message: 'UPI ID is required for UPI method',
  path: ['upiId']
}).refine(data => {
  if (data.payoutMethod === 'UPI' && data.upiId) {
    return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(data.upiId);
  }
  return true;
}, {
  message: 'Invalid UPI ID format',
  path: ['upiId']
});

export type SavePayoutInput = z.infer<typeof savePayoutSchema>;
