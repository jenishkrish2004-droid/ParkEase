// ============================================================
// Register Page
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/providers/AuthProvider';
import { showToast } from '@/components/ui/Toast';
import { getApiErrorMessage, getApiValidationErrors } from '@/lib/api-client';

// ── Validation Schema ────────────────────────────────────────
const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name is too long')
      .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name is required')
      .max(50, 'Last name is too long')
      .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
    email: z
      .string()
      .trim()
      .email('Please enter a valid email address')
      .max(255),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[0-9]/, 'Must include a number'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v, 'You must accept the terms to continue'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ── Password Strength Indicator ──────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', valid: password.length >= 8 },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'Number', valid: /[0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;
  const strength = score <= 1 ? 'weak' : score <= 2 ? 'fair' : score <= 3 ? 'good' : 'strong';
  const colors = {
    weak:   'bg-danger-500',
    fair:   'bg-warning-500',
    good:   'bg-blue-500',
    strong: 'bg-success-500',
  };
  const labels = { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i <= score ? colors[strength] : 'bg-secondary-200',
            )}
          />
        ))}
      </div>
      {/* Label + checks */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map((check) => (
            <span
              key={check.label}
              className={cn(
                'text-xs flex items-center gap-1',
                check.valid ? 'text-success-600' : 'text-secondary-400',
              )}
            >
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                {check.valid ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                )}
              </svg>
              {check.label}
            </span>
          ))}
        </div>
        <span className={cn('text-xs font-medium', colors[strength].replace('bg-', 'text-'))}>
          {labels[strength]}
        </span>
      </div>
    </div>
  );
}

// ── Field Error ──────────────────────────────────────────────
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-danger-600 flex items-center gap-1" role="alert">
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );
}

// ── Input ────────────────────────────────────────────────────
function inputClass(hasError: boolean) {
  return cn(
    'w-full px-3.5 py-2.5 rounded-xl text-sm',
    'border bg-white text-secondary-900 placeholder:text-secondary-400',
    'transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    hasError
      ? 'border-danger-400 focus:ring-danger-500'
      : 'border-secondary-300 hover:border-secondary-400',
  );
}

// ── Component ────────────────────────────────────────────────
export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        firstName:       data.firstName,
        lastName:        data.lastName,
        email:           data.email,
        password:        data.password,
        confirmPassword: data.confirmPassword,
      });
      window.location.replace('/dashboard');
    } catch (error) {
      const fieldErrors = getApiValidationErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field as keyof RegisterFormValues, { message });
        });
      } else {
        showToast.error(getApiErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 3h5c1.657 0 3 1.343 3 3s-1.343 3-3 3H6v4H4V3z" fill="white" />
              <path d="M6 7h3a1 1 0 000-2H6v2z" fill="#BFDBFE" />
            </svg>
          </div>
          <span className="font-bold text-base text-secondary-900 font-display tracking-tight">ParkEase</span>
        </Link>
        <p className="text-sm text-secondary-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 no-underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl border border-secondary-200 shadow-card p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-secondary-900 font-display">Create your account</h1>
              <p className="mt-1.5 text-sm text-secondary-500">Join thousands of drivers parking smarter</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-first-name" className="block text-sm font-medium text-secondary-700 mb-1.5">
                    First name
                  </label>
                  <input
                    {...register('firstName')}
                    id="reg-first-name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Priya"
                    className={inputClass(!!errors.firstName)}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? 'reg-fname-error' : undefined}
                  />
                  <FieldError id="reg-fname-error" message={errors.firstName?.message} />
                </div>
                <div>
                  <label htmlFor="reg-last-name" className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Last name
                  </label>
                  <input
                    {...register('lastName')}
                    id="reg-last-name"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Sharma"
                    className={inputClass(!!errors.lastName)}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? 'reg-lname-error' : undefined}
                  />
                  <FieldError id="reg-lname-error" message={errors.lastName?.message} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Email address
                </label>
                <input
                  {...register('email')}
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass(!!errors.email)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'reg-email-error' : undefined}
                />
                <FieldError id="reg-email-error" message={errors.email?.message} />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    className={inputClass(!!errors.password)}
                    aria-invalid={!!errors.password}
                    aria-describedby="reg-password-strength"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div id="reg-password-strength">
                  <PasswordStrength password={passwordValue} />
                </div>
                {errors.password && (
                  <FieldError id="reg-password-error" message={errors.password.message} />
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className={inputClass(!!errors.confirmPassword)}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <FieldError id="reg-confirm-error" message={errors.confirmPassword?.message} />
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    {...register('terms')}
                    id="reg-terms"
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    aria-describedby={errors.terms ? 'reg-terms-error' : undefined}
                  />
                  <span className="text-sm text-secondary-600 leading-snug">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                <FieldError id="reg-terms-error" message={errors.terms?.message} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="register-submit-btn"
                className={cn(
                  'w-full h-11 flex items-center justify-center gap-2 mt-2',
                  'bg-primary-600 hover:bg-primary-700 active:bg-primary-800',
                  'text-white font-semibold text-sm rounded-xl',
                  'transition-all duration-150 shadow-sm hover:shadow-md',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  'disabled:opacity-60 disabled:cursor-not-allowed',
                )}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-secondary-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 no-underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
