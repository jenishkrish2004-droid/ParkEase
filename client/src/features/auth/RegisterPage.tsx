import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/providers/AuthProvider';
import { showToast } from '@/components/ui/Toast';
import { getApiErrorMessage, getApiValidationErrors } from '@/lib/api-client';

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
    identifier: z
      .string()
      .trim()
      .toLowerCase()
      .refine((val) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isPhone = /^\+?[1-9]\d{9,14}$/.test(val);
        return isEmail || isPhone;
      }, 'Please enter a valid email address or phone number'),
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
    weak:   'bg-[#ffb4ab]', // error
    fair:   'bg-[#d4af37]', // primary-container
    good:   'bg-[#97b0ff]', // tertiary-container
    strong: 'bg-[#554300]', // on-primary-container
  };
  const labels = { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' };

  if (!password) return null;

  return (
    <div className="mt-1.5 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i <= score ? colors[strength] : 'bg-[#4d4635]', // outline-variant
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {checks.map((check) => (
            <span
              key={check.label}
              className={cn(
                'text-[10px] flex items-center gap-0.5 font-semibold uppercase tracking-wider',
                check.valid ? 'text-[#f2ca50]' : 'text-[#d0c5af]/50', // primary vs on-surface-variant
              )}
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
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
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const { register: registerUser, verifyRegistration } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [registeredIdentifier, setRegisteredIdentifier] = useState('');
  const [otp, setOtp] = useState('');

  const {
    register,
    handleSubmit,
    watch,
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
      const response = await registerUser({
        firstName:       data.firstName,
        lastName:        data.lastName,
        identifier:      data.identifier,
        password:        data.password,
        confirmPassword: data.confirmPassword,
      });
      setRegisteredUserId(response.user.id);
      setRegisteredIdentifier(data.identifier);
      setStep(2);
      showToast.success('Account created! Please verify your identifier.');
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredUserId || otp.length !== 6) return;

    setIsSubmitting(true);
    try {
      await verifyRegistration({
        userId: registeredUserId,
        otp,
      });
      showToast.success('Verification successful!');
      window.location.replace('/dashboard');
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glows = document.querySelectorAll('.floating-glow') as NodeListOf<HTMLElement>;
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      
      glows.forEach((glow, index) => {
        const speed = (index + 1) * 0.1;
        glow.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const inputClass = (hasError: boolean) => cn(
    "auth-input w-full text-sm rounded-xl py-3 px-4 font-sans bg-transparent border-secondary-300 dark:border-white/10 focus:border-primary-500 dark:focus:border-primary-400 text-secondary-900 dark:text-[#eae1d4] placeholder:text-secondary-400 dark:placeholder:text-white/30",
    hasError && "border-danger-500 dark:border-[#ffb4ab]/50 focus:border-danger-500 dark:focus:border-[#ffb4ab] shadow-none"
  );

  return (
    <div className="auth-theme luminous-stack flex min-h-screen w-full flex-col md:flex-row bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] relative transition-colors duration-300">
      {/* Global Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-400 dark:bg-[#f2ca50] opacity-10 blur-[120px] rounded-full floating-glow pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary-600 dark:bg-[#d4af37] opacity-10 blur-[120px] rounded-full floating-glow pointer-events-none" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-primary-300 dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full floating-glow pointer-events-none" style={{ animationDelay: '-7s' }}></div>

      {/* Left Side: Atmospheric Brand Section */}
      <section className="relative flex-1 flex flex-col justify-center px-6 md:px-10 py-10 z-10 hidden lg:flex">
        <div className="space-y-10 max-w-2xl mx-auto md:mx-0 lg:ml-12 -translate-y-16">
          {/* Branding Header */}
          <div className="pt-6">
            <div className="font-display text-5xl tracking-tight font-extrabold flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37]">
                Parkora
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-300 dark:to-emerald-500">
                EV
              </span>
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-5">
            <h1 className="font-display text-4xl md:text-5xl text-secondary-900 dark:text-[#eae1d4] font-bold leading-tight tracking-tight">
              Smart Parking and EV Charging <span className="text-primary-600 dark:text-[#d4af37]">Platform.</span>
            </h1>
            <p className="font-sans text-base md:text-lg text-secondary-600 dark:text-[#d0c5af] max-w-md leading-relaxed">
              Experience seamless arrivals and priority access across the city's most exclusive districts. Reserved for those who value time and precision.
            </p>
          </div>

          <div>
            {/* Divider */}
            <div className="w-20 h-px bg-secondary-200 dark:bg-[#4d4635] mb-8"></div>

            {/* Tag */}
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 dark:bg-[#f2ca50]/10 border border-primary-200 dark:border-[#f2ca50]/20 text-primary-700 dark:text-[#f2ca50] text-xs tracking-widest uppercase font-semibold">
                <span className="material-symbols-outlined text-[16px] mr-2">stars</span>
                Book. Park. List. Earn with smart parking
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-primary-600 dark:text-[#f2ca50] text-[22px]">check_circle</span>
                <span className="font-sans text-base text-secondary-900 dark:text-[#eae1d4]">Find parking spots instantly</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-primary-600 dark:text-[#f2ca50] text-[22px]">check_circle</span>
                <span className="font-sans text-base text-secondary-900 dark:text-[#eae1d4]">Earn from unused parking spaces</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-primary-600 dark:text-[#f2ca50] text-[22px]">check_circle</span>
                <span className="font-sans text-base text-secondary-900 dark:text-[#eae1d4]">Locate & book EV charging stations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Register Section */}
      <section className="relative flex-1 flex items-center justify-center p-6 z-10 my-8 lg:my-0">
        {/* Register Card */}
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl w-full max-w-lg p-6 lg:p-8 rounded-2xl relative my-10 lg:my-0 backdrop-blur-2xl">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-secondary-900 dark:text-[#eae1d4] mb-1">
              {step === 1 ? 'Create your account' : 'Verify your account'}
            </h2>
            <p className="font-sans text-secondary-600 dark:text-[#d0c5af] text-sm">
              {step === 1 ? 'Join the exclusive parking network.' : `We've sent an OTP to ${registeredIdentifier}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-secondary-600 dark:text-[#d0c5af] tracking-wide" htmlFor="firstName">First name</label>
                  <input {...register('firstName')} id="firstName" placeholder="First name" className={inputClass(!!errors.firstName)} />
                  {errors.firstName && <p className="text-danger-500 dark:text-[#ffb4ab] text-[10px] mt-1">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-secondary-600 dark:text-[#d0c5af] tracking-wide" htmlFor="lastName">Last name</label>
                  <input {...register('lastName')} id="lastName" placeholder="Last name" className={inputClass(!!errors.lastName)} />
                  {errors.lastName && <p className="text-danger-500 dark:text-[#ffb4ab] text-[10px] mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary-600 dark:text-[#d0c5af] tracking-wide" htmlFor="identifier">Email or Phone</label>
                <div className="relative">
                  <input 
                    {...register('identifier')}
                    id="identifier"
                    placeholder="Enter your email or phone number"
                    className={inputClass(!!errors.identifier)}
                  />
                </div>
                {errors.identifier && <p className="text-danger-500 dark:text-[#ffb4ab] text-[10px] mt-1">{errors.identifier.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary-600 dark:text-[#d0c5af] tracking-wide" htmlFor="password">Password</label>
                <div className="relative group/input">
                  <input 
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className={cn(inputClass(!!errors.password), "pr-10")}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-[#d0c5af] hover:text-secondary-600 dark:hover:text-[#eae1d4] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                <PasswordStrength password={passwordValue} />
                {errors.password && <p className="text-danger-500 dark:text-[#ffb4ab] text-[10px] mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary-600 dark:text-[#d0c5af] tracking-wide" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative group/input">
                  <input 
                    {...register('confirmPassword')}
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    className={cn(inputClass(!!errors.confirmPassword), "pr-10")}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-[#d0c5af] hover:text-secondary-600 dark:hover:text-[#eae1d4] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-danger-500 dark:text-[#ffb4ab] text-[10px] mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input 
                    {...register('terms')} 
                    type="checkbox" 
                    className="mt-0.5 w-3.5 h-3.5 rounded border-secondary-300 bg-white text-primary-500 focus:ring-primary-500 dark:border-[#4d4635] dark:bg-[#2d2a21] dark:text-[#f2ca50] dark:focus:ring-[#f2ca50] dark:focus:ring-offset-[#110e07]" 
                  />
                  <span className="text-[11px] text-secondary-600 dark:text-[#d0c5af] leading-snug">
                    I agree to the <Link to="/terms" className="text-primary-600 dark:text-[#f2ca50] hover:text-primary-700 dark:hover:text-[#d4af37] transition-colors">Terms of Service</Link> and <Link to="/privacy" className="text-primary-600 dark:text-[#f2ca50] hover:text-primary-700 dark:hover:text-[#d4af37] transition-colors">Privacy Policy</Link>
                  </span>
                </label>
                {errors.terms && <p className="text-danger-500 dark:text-[#ffb4ab] text-[10px]">{errors.terms.message}</p>}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="gold-glow-button w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-[#3c2f00] font-semibold text-base group mt-6 disabled:opacity-70 disabled:hover:transform-none shadow-md dark:shadow-[0_0_15px_rgba(242,202,80,0.5)] transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="otp" className="text-xs font-medium text-secondary-600 dark:text-[#d0c5af] tracking-wide block">Enter 6-digit OTP</label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className={cn(inputClass(false), "text-center text-2xl tracking-[0.4em] font-display py-4")}
                  autoComplete="one-time-code"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="gold-glow-button w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-[#3c2f00] font-semibold text-base group mt-5 disabled:opacity-70 disabled:hover:transform-none shadow-md dark:shadow-[0_0_15px_rgba(242,202,80,0.5)] transition-all duration-300"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>
          )}

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative flex items-center justify-center py-3">
              <div className="flex-grow border-t border-secondary-200 dark:border-[#4d4635]"></div>
              <span className="flex-shrink mx-3 text-[10px] font-semibold tracking-widest text-secondary-500 dark:text-[#d0c5af] bg-transparent uppercase">Or continue with</span>
              <div className="flex-grow border-t border-secondary-200 dark:border-[#4d4635]"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button disabled className="flex items-center justify-center gap-2 py-2.5 border border-secondary-200 dark:border-[#4d4635] rounded-xl hover:bg-secondary-50 dark:hover:bg-[#38342b] transition-colors opacity-50 cursor-not-allowed">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
                <span className="text-xs font-medium text-secondary-900 dark:text-[#eae1d4]">Google</span>
              </button>
              <button disabled className="flex items-center justify-center gap-2 py-2.5 border border-secondary-200 dark:border-[#4d4635] rounded-xl hover:bg-secondary-50 dark:hover:bg-[#38342b] transition-colors opacity-50 cursor-not-allowed">
                <svg className="w-4 h-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                <span className="text-xs font-medium text-secondary-900 dark:text-[#eae1d4]">LinkedIn</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-secondary-600 dark:text-[#d0c5af]">
            Already have an account? 
            <Link to="/login" className="text-primary-600 dark:text-[#f2ca50] font-semibold hover:underline transition-all ml-1">Sign in instead</Link>
          </p>
        </div>

        {/* Subtle background branding on right side */}
        <div className="absolute bottom-6 right-6 opacity-20 hidden md:block pointer-events-none">
          <p className="text-[10px] tracking-[0.2em] text-secondary-500 dark:text-[#d0c5af] uppercase font-semibold">Parkora EV Urban Solutions &copy; 2024</p>
        </div>
      </section>
    </div>
  );
}
