// ============================================================
// Forgot Password Page — Placeholder (Phase 2)
// ============================================================
// Full OTP-based reset implemented in Phase 6.
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const forgotSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  // TODO Phase 6: Call POST /api/v1/auth/forgot-password
  const onSubmit = async (data: ForgotFormValues) => {
    // Simulate a delay (placeholder — no backend endpoint yet)
    await new Promise((r) => setTimeout(r, 800));
    setSubmittedEmail(data.email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-secondary-200 px-6 py-4 flex items-center shrink-0">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 3h5c1.657 0 3 1.343 3 3s-1.343 3-3 3H6v4H4V3z" fill="white" />
              <path d="M6 7h3a1 1 0 000-2H6v2z" fill="#BFDBFE" />
            </svg>
          </div>
          <span className="font-bold text-base text-secondary-900 font-display tracking-tight">ParkEase</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-secondary-200 shadow-card p-8">
            {!submitted ? (
              <>
                {/* Back link */}
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-secondary-500 hover:text-secondary-700 no-underline mb-6 group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back to sign in
                </Link>

                {/* Icon */}
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>

                <h1 className="text-2xl font-bold text-secondary-900 font-display mb-2">
                  Forgot your password?
                </h1>
                <p className="text-sm text-secondary-500 mb-8">
                  No worries. Enter your email address and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-secondary-700 mb-1.5">
                      Email address
                    </label>
                    <input
                      {...register('email')}
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      placeholder="you@example.com"
                      className={cn(
                        'w-full px-3.5 py-2.5 rounded-xl text-sm',
                        'border bg-white text-secondary-900 placeholder:text-secondary-400',
                        'transition-colors duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        errors.email
                          ? 'border-danger-400 focus:ring-danger-500'
                          : 'border-secondary-300 hover:border-secondary-400',
                      )}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'forgot-email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="forgot-email-error" className="mt-1.5 text-xs text-danger-600 flex items-center gap-1" role="alert">
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full h-11 flex items-center justify-center gap-2',
                      'bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl',
                      'transition-all duration-150 shadow-sm hover:shadow-md',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                      'disabled:opacity-60 disabled:cursor-not-allowed',
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-success-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-secondary-900 mb-2">Check your email</h2>
                <p className="text-sm text-secondary-500 mb-1">
                  We sent a password reset link to
                </p>
                <p className="text-sm font-semibold text-secondary-700 mb-6 break-all">
                  {submittedEmail}
                </p>
                <p className="text-xs text-secondary-400 mb-8">
                  Didn't receive it? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    try again
                  </button>
                  .
                </p>

                {/* Coming soon note */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left">
                  <p className="text-xs text-amber-700 font-medium">
                    🚧 Full password reset (Phase 6)
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Email delivery and OTP verification will be wired up in Phase 6.
                  </p>
                </div>

                <Link
                  to="/login"
                  className={cn(
                    'mt-6 inline-flex items-center justify-center w-full h-10 rounded-xl',
                    'text-sm font-medium text-secondary-700 border border-secondary-300',
                    'hover:bg-secondary-50 transition-colors no-underline',
                  )}
                >
                  Back to sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
