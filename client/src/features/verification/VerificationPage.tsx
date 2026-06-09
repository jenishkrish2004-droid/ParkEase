import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { getVerificationStatus, sendOtp, verifyOtp, type VerificationStatusResponse } from './verification.service';
import { getKycStatus, saveKycDraft, submitKyc, uploadKycDocument, type KycProfile } from './kyc.service';
import { getPayoutAccount, savePayoutAccount, type OwnerPayoutAccount } from './payout.service';
import { getSelfieStatus, uploadSelfie, type SelfieVerification } from './selfie.service';
import { useParkEaseMode } from '@/app/providers/useParkEaseMode';
import { cn } from '@/lib/utils';
import { PageLayout } from '@/components/layout/PageLayout';
import { showToast } from '@/components/ui/Toast';
import { getApiErrorMessage } from '@/lib/api-client';

const OTP_VALIDITY_SECONDS = 120;
const OTP_COOLDOWN_SECONDS = 30;

function useTimer(initialValue = 0) {
  const [timeLeft, setTimeLeft] = useState(initialValue);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);
  
  const start = (seconds: number) => setTimeLeft(seconds);
  const stop = () => setTimeLeft(0);
  
  return { timeLeft, start, stop };
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function VerificationPage() {
  const { user, refreshUser } = useAuth();
  const [mode] = useParkEaseMode();
  const [status, setStatus] = useState<VerificationStatusResponse | null>(null);
  const [kycProfile, setKycProfile] = useState<KycProfile | null>(null);
  const [payoutProfile, setPayoutProfile] = useState<OwnerPayoutAccount | null>(null);
  const [selfieProfile, setSelfieProfile] = useState<SelfieVerification | null>(null);
  const [loading, setLoading] = useState(true);
  
  // KYC State
  const [kycForm, setKycForm] = useState<Partial<KycProfile>>({});
  const [kycProcessing, setKycProcessing] = useState(false);
  const [isEditingKyc, setIsEditingKyc] = useState(false);
  
  // Payout State
  const [payoutForm, setPayoutForm] = useState<Partial<OwnerPayoutAccount>>({ payoutMethod: 'BANK' });
  
  // Selfie State
  const [selfieProcessing, setSelfieProcessing] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  
  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const isKycDisabled = (!isEditingKyc && (kycProfile?.status === 'UNDER_REVIEW' || kycProfile?.status === 'APPROVED')) || kycProcessing;
  
  const hasAadhaar = Boolean(kycForm.aadhaarNumber && kycForm.aadhaarUrl);
  const hasPan = Boolean(kycForm.panNumber && kycForm.panUrl);
  const isKycComplete = Boolean(kycForm.fullName && kycForm.dateOfBirth && (hasAadhaar || hasPan));
  
  const isPayoutComplete = payoutForm.payoutMethod === 'BANK'
    ? Boolean(payoutForm.accountHolderName && payoutForm.bankName && payoutForm.accountNumber && payoutForm.ifscCode && (payoutForm as any).confirmAccountNumber === payoutForm.accountNumber)
    : Boolean(payoutForm.accountHolderName && payoutForm.upiId);
  
  // OTP States
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [processing, setProcessing] = useState(false);

  // Add Email/Phone State
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  // OTP State

  const emailCountdown = useTimer(0);
  const emailCooldown = useTimer(0);
  
  const phoneCountdown = useTimer(0);
  const phoneCooldown = useTimer(0);

  useEffect(() => {
    fetchStatus();
    
    // Background glow atmosphere animation
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

  const fetchStatus = async () => {
    try {
      const [data, kycData, payoutData, selfieData] = await Promise.all([
        getVerificationStatus(),
        getKycStatus(),
        getPayoutAccount().catch(() => null), // Ignore error if not set up
        getSelfieStatus().catch(() => null)
      ]);
      setStatus(data);
      setKycProfile(kycData);
      setKycForm(kycData || {});
      setPayoutProfile(payoutData);
      setPayoutForm(payoutData || { payoutMethod: 'BANK' });
      setSelfieProfile(selfieData);
    } catch (err: any) {
      showToast.error('Failed to load verification status');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (type: 'EMAIL' | 'PHONE') => {
    setProcessing(true);
    try {
      const target = type === 'PHONE' ? newPhone.trim() : newEmail.trim();
      await sendOtp(type, target);
      if (type === 'EMAIL') {
        setEmailOtpSent(true);
        emailCountdown.start(OTP_VALIDITY_SECONDS);
        emailCooldown.start(OTP_COOLDOWN_SECONDS);
        setEmailOtp('');
        showToast.success('Verification code sent to your email.');
      }
      if (type === 'PHONE') {
        setPhoneOtpSent(true);
        phoneCountdown.start(OTP_VALIDITY_SECONDS);
        phoneCooldown.start(OTP_COOLDOWN_SECONDS);
        setPhoneOtp('');
        showToast.success('Verification code sent to your phone.');
      }
    } catch (err: any) {
      showToast.error(getApiErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const handleVerifyOtp = async (type: 'EMAIL' | 'PHONE') => {
    setProcessing(true);
    try {
      const otp = type === 'EMAIL' ? emailOtp : phoneOtp;
      const newStatus = await verifyOtp(type, otp);
      setStatus(newStatus);
      showToast.success(`${type === 'EMAIL' ? 'Email' : 'Phone'} verified successfully!`);
      await refreshUser();
      
      if (type === 'EMAIL') {
        setEmailOtpSent(false);
        emailCountdown.stop();
        emailCooldown.stop();
      }
      if (type === 'PHONE') {
        setPhoneOtpSent(false);
        phoneCountdown.stop();
        phoneCooldown.stop();
      }
    } catch (err: any) {
      showToast.error(getApiErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };


  const handleSaveDraft = async () => {
    setKycProcessing(true);
    try {
      const data = await saveKycDraft(kycForm);
      setKycProfile(data);
      setKycForm(data);
      showToast.success('Draft saved successfully');
    } catch (err: any) {
      showToast.error(getApiErrorMessage(err));
    } finally {
      setKycProcessing(false);
    }
  };

  const handleSubmitKyc = async () => {
    setKycProcessing(true);
    try {
      const data = await submitKyc(kycForm);
      setKycProfile(data);
      setKycForm(data);
      setIsEditingKyc(false);
      showToast.success('KYC submitted successfully');
    } catch (err: any) {
      showToast.error(getApiErrorMessage(err));
    } finally {
      setKycProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'aadhaarUrl' | 'panUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('File size must be less than 5MB');
      return;
    }
    
    setKycProcessing(true);
    try {
      const url = await uploadKycDocument(file);
      setKycForm(prev => ({ ...prev, [field]: url }));
      showToast.success('Document uploaded successfully');
    } catch (err: any) {
      showToast.error(getApiErrorMessage(err));
    } finally {
      setKycProcessing(false);
    }
  };


  const handleUploadSelfie = async () => {
    if (!selfieFile) return;
    setSelfieProcessing(true);
    try {
      const data = await uploadSelfie(selfieFile);
      setSelfieProfile(data);
      setSelfieFile(null);
      setSelfiePreview(null);
      showToast.success('Selfie uploaded successfully');
    } catch (err: any) {
      showToast.error(getApiErrorMessage(err));
    } finally {
      setSelfieProcessing(false);
    }
  };

  const handleSelfieFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast.error('File size must be less than 5MB');
      return;
    }

    setSelfieFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSelfiePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      showToast.error("Could not access camera. Please allow camera permissions or upload a file instead.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setSelfiePreview(dataUrl);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
        setSelfieFile(file);
      }
    }, 'image/jpeg');
    
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (isCameraOpen) stopCamera();
    };
  }, [isCameraOpen]);

  if (loading || !status) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      </PageLayout>
    );
  }

  const kycProgress = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED'].includes(kycProfile?.status || '') ? 25 : 0;
  const payoutProgress = payoutProfile?.status && payoutProfile.status !== 'NOT_CONFIGURED' ? 25 : 0;
  const selfieProgress = selfieProfile?.status === 'APPROVED' ? 25 : 0;
  const contactProgress = (status.isEmailVerified && status.isPhoneVerified) ? 25 : 0;
  
  const progress = mode === 'booking' 
    ? ((status.isEmailVerified || status.isPhoneVerified) ? 100 : 0)
    : (contactProgress + kycProgress + selfieProgress + payoutProgress);

  let displayStatus: string = status.verificationStatus;
  if (mode === 'owner') {
    if (progress === 100) displayStatus = 'APPROVED';
    else if (progress > 0) displayStatus = 'IN PROGRESS';
    else displayStatus = 'NOT STARTED';
  } else {
    displayStatus = progress === 100 ? 'APPROVED' : 'PENDING';
  }

  return (
    <PageLayout mainClassName="auth-theme luminous-stack bg-white dark:bg-[#110e07] relative transition-colors duration-300 min-h-screen">
      {/* Global Background Atmosphere */}
      <div className="absolute top-[5%] left-[5%] w-[40%] h-[40%] bg-primary-400 dark:bg-[#f2ca50] opacity-10 blur-[120px] rounded-full floating-glow pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[5%] w-[40%] h-[50%] bg-primary-600 dark:bg-[#d4af37] opacity-10 blur-[120px] rounded-full floating-glow pointer-events-none z-0" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[10%] left-[30%] w-[40%] h-[40%] bg-primary-300 dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full floating-glow pointer-events-none z-0" style={{ animationDelay: '-7s' }}></div>

      <div className="max-w-4xl mx-auto space-y-6 py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-secondary-900 dark:text-[#eae1d4]">
              {mode === 'owner' ? 'Owner Verification' : 'Verification'}
            </h1>
            <p className="text-secondary-500 dark:text-[#d0c5af] mt-1">
              {mode === 'owner' 
                ? 'Complete your profile verification to unlock all features.' 
                : 'Verify your email or phone number to start booking.'}
            </p>
          </div>
        </div>

        {/* Overview Card */}
        <div className="bg-white/80 dark:bg-transparent surface-glass p-6 rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-lg backdrop-blur-2xl hover:border-primary-400 dark:hover:border-[#f2ca50]/50 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(242,202,80,0.15)] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">Verification Progress</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-secondary-500">Status:</span>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-bold",
                displayStatus === 'APPROVED' ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400" :
                displayStatus === 'PENDING' ? "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400" :
                displayStatus === 'IN PROGRESS' ? "bg-primary-100 text-primary-700" :
                "bg-secondary-100 dark:bg-white/10 text-secondary-700 dark:text-[#d0c5af]"
              )}>
                {displayStatus}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-secondary-700 dark:text-[#eae1d4]">{progress}% Completed</span>
              {mode === 'owner' && <span className="text-secondary-500 dark:text-[#d0c5af]">Level 1</span>}
            </div>
            <div className="h-2 w-full bg-secondary-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Visual checklist */}
            <div className={cn("grid gap-3 pt-4", mode === 'owner' ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2")}>
              <div className="flex items-center gap-2">
                <span className={status.isEmailVerified && status.isPhoneVerified ? "text-success-500" : "text-secondary-400"}>
                  {status.isEmailVerified && status.isPhoneVerified ? "✓" : "○"}
                </span>
                <span className={cn("text-xs font-medium", status.isEmailVerified && status.isPhoneVerified ? "text-secondary-900 dark:text-[#eae1d4]" : "text-secondary-500 dark:text-[#d0c5af]")}>Contact</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={kycProfile?.status === 'APPROVED' ? "text-success-500" : kycProfile?.status === 'UNDER_REVIEW' ? "text-warning-500" : "text-secondary-400"}>
                  {kycProfile?.status === 'APPROVED' ? "✓" : kycProfile?.status === 'UNDER_REVIEW' ? "⏳" : "○"}
                </span>
                <span className={cn("text-xs font-medium", kycProfile?.status && kycProfile.status !== 'NOT_STARTED' ? "text-secondary-900 dark:text-[#eae1d4]" : "text-secondary-500 dark:text-[#d0c5af]")}>Identity</span>
              </div>
              {mode === 'owner' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className={selfieProfile?.status === 'APPROVED' ? "text-success-500" : selfieProfile?.status === 'UNDER_REVIEW' ? "text-warning-500" : "text-secondary-400"}>
                      {selfieProfile?.status === 'APPROVED' ? "✓" : selfieProfile?.status === 'UNDER_REVIEW' ? "⏳" : "○"}
                    </span>
                    <span className={cn("text-xs font-medium", selfieProfile?.status && selfieProfile.status !== 'NOT_SUBMITTED' ? "text-secondary-900 dark:text-[#eae1d4]" : "text-secondary-500 dark:text-[#d0c5af]")}>Selfie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={payoutProfile?.status === 'VERIFIED' ? "text-success-500" : payoutProfile?.status === 'CONFIGURED' ? "text-primary-500" : "text-secondary-400"}>
                      {payoutProfile?.status === 'VERIFIED' || payoutProfile?.status === 'CONFIGURED' ? "✓" : "○"}
                    </span>
                    <span className={cn("text-xs font-medium", payoutProfile?.status && payoutProfile.status !== 'NOT_CONFIGURED' ? "text-secondary-900 dark:text-[#eae1d4]" : "text-secondary-500 dark:text-[#d0c5af]")}>Payout</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Verification Steps */}
        <div className="space-y-8">
          
          {/* 1. Contact Verification */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4]">1. Contact Verification</h2>
              <p className="text-sm text-secondary-500 dark:text-[#d0c5af] mt-1">Verify your contact details to secure your account.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email Card */}
              <div className="bg-white/80 dark:bg-transparent surface-glass p-6 rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-lg backdrop-blur-2xl hover:border-primary-400 dark:hover:border-[#f2ca50]/50 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(242,202,80,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col h-full group">
                <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4] mb-2">Email Address</h3>
            <p className="text-sm text-secondary-500 dark:text-[#d0c5af] mb-6">Verify your email address for account security and important updates.</p>
            
            <div className="flex-1">
              {status.isEmailVerified && !isEditingEmail ? (
                <>
                  <div className="text-sm font-medium text-secondary-900 dark:text-[#eae1d4] mb-4 bg-secondary-50 dark:bg-[#1a1712]/50 p-3 rounded-lg border border-secondary-100 dark:border-[#4d4635] flex items-center justify-between">
                    <span>{user?.email}</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100 text-success-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-4 p-4 bg-success-50 dark:bg-success-900/10 border border-success-200 dark:border-success-500/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-success-100 dark:bg-success-900/30 p-2 rounded-full">
                        <svg className="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-success-800">Email verified</p>
                    </div>
                    <button onClick={() => setIsEditingEmail(true)} className="text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors px-3 py-1 rounded-md hover:bg-primary-50">
                      Change
                    </button>
                  </div>
                </>
              ) : emailOtpSent ? (
                <div className="space-y-4">
                  <div className="text-sm text-secondary-600 dark:text-[#d0c5af] flex justify-between items-center">
                    <span>OTP sent to: <strong>{newEmail || user?.email}</strong></span>
                    {emailCountdown.timeLeft > 0 ? (
                      <span className="font-mono text-primary-600 font-medium">Time remaining: {formatTime(emailCountdown.timeLeft)}</span>
                    ) : (
                      <span className="text-danger-600 font-medium">OTP expired. Please request a new code.</span>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                    disabled={emailCountdown.timeLeft === 0}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:bg-secondary-50"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerifyOtp('EMAIL')}
                      disabled={processing || emailOtp.length !== 6 || emailCountdown.timeLeft === 0}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Verify OTP
                    </button>
                    <button
                      onClick={() => handleSendOtp('EMAIL')}
                      disabled={processing || emailCooldown.timeLeft > 0}
                      className="flex-1 bg-secondary-100 dark:bg-white/10 hover:bg-secondary-200 dark:hover:bg-white/20 text-secondary-900 dark:text-[#eae1d4] font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {emailCooldown.timeLeft > 0 ? `Resend (${emailCooldown.timeLeft}s)` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {!user?.email && (
                    <div className="text-sm text-warning-700 bg-warning-50 dark:bg-warning-900/10 p-3 rounded-lg border border-warning-200 dark:border-warning-500/20">
                      No email address set. Please add one to continue.
                    </div>
                  )}
                  {isEditingEmail ? (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          disabled={processing}
                          className="flex-1 px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        />
                        <button
                          onClick={() => handleSendOtp('EMAIL')}
                          disabled={processing || !newEmail.trim()}
                          className="bg-secondary-900 hover:bg-secondary-800 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          Send OTP
                        </button>
                      </div>
                      <button 
                        onClick={() => setIsEditingEmail(false)}
                        className="text-sm font-medium text-secondary-500 hover:text-secondary-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingEmail(true)}
                      disabled={processing}
                      className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium px-4 py-2 rounded-lg transition-colors border border-primary-200"
                    >
                      {user?.email ? 'Change Email' : 'Add Email Address'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white/80 dark:bg-transparent surface-glass p-6 rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-lg backdrop-blur-2xl hover:border-primary-400 dark:hover:border-[#f2ca50]/50 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(242,202,80,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col h-full group">
            <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4] mb-2">2. Phone Number</h3>
            <p className="text-sm text-secondary-500 dark:text-[#d0c5af] mb-6">Verify your phone number to enable SMS notifications and seamless bookings.</p>
            
            <div className="flex-1">
              {status.isPhoneVerified && !isEditingPhone ? (
                <>
                  <div className="text-sm font-medium text-secondary-900 dark:text-[#eae1d4] mb-4 bg-secondary-50 dark:bg-[#1a1712]/50 p-3 rounded-lg border border-secondary-100 dark:border-[#4d4635] flex items-center justify-between">
                    <span>{user?.phone}</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100 text-success-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-4 p-4 bg-success-50 dark:bg-success-900/10 border border-success-200 dark:border-success-500/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-success-100 dark:bg-success-900/30 p-2 rounded-full">
                        <svg className="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-success-800">Phone verified</p>
                    </div>
                    <button onClick={() => setIsEditingPhone(true)} className="text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors px-3 py-1 rounded-md hover:bg-primary-50">
                      Change
                    </button>
                  </div>
                </>
              ) : phoneOtpSent ? (
                <div className="space-y-4">
                  <div className="text-sm text-secondary-600 dark:text-[#d0c5af] flex justify-between items-center">
                    <span>OTP sent to: <strong>{newPhone || user?.phone}</strong></span>
                    {phoneCountdown.timeLeft > 0 ? (
                      <span className="font-mono text-primary-600 font-medium">Time remaining: {formatTime(phoneCountdown.timeLeft)}</span>
                    ) : (
                      <span className="text-danger-600 font-medium">OTP expired. Please request a new code.</span>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                    disabled={phoneCountdown.timeLeft === 0}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:bg-secondary-50"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerifyOtp('PHONE')}
                      disabled={processing || phoneOtp.length !== 6 || phoneCountdown.timeLeft === 0}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Verify OTP
                    </button>
                    <button
                      onClick={() => handleSendOtp('PHONE')}
                      disabled={processing || phoneCooldown.timeLeft > 0}
                      className="flex-1 bg-secondary-100 dark:bg-white/10 hover:bg-secondary-200 dark:hover:bg-white/20 text-secondary-900 dark:text-[#eae1d4] font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {phoneCooldown.timeLeft > 0 ? `Resend (${phoneCooldown.timeLeft}s)` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {!user?.phone && (
                    <div className="text-sm text-warning-700 bg-warning-50 dark:bg-warning-900/10 p-3 rounded-lg border border-warning-200 dark:border-warning-500/20">
                      No phone number set. Please add one to continue.
                    </div>
                  )}
                  {isEditingPhone ? (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          disabled={processing}
                          className="flex-1 px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        />
                        <button
                          onClick={() => handleSendOtp('PHONE')}
                          disabled={processing || !newPhone.trim()}
                          className="bg-secondary-900 hover:bg-secondary-800 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          Send OTP
                        </button>
                      </div>
                      <button 
                        onClick={() => setIsEditingPhone(false)}
                        className="text-sm font-medium text-secondary-500 hover:text-secondary-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      disabled={processing}
                      className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium px-4 py-2 rounded-lg transition-colors border border-primary-200"
                    >
                      {user?.phone ? 'Change Phone Number' : 'Add Phone Number'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
        
        {/* 2. Identity Verification */}
        {mode === 'owner' && (
          <div className="bg-white/80 dark:bg-transparent surface-glass rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-lg backdrop-blur-2xl hover:border-primary-400 dark:hover:border-[#f2ca50]/50 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(242,202,80,0.15)] transition-all duration-300 overflow-hidden">
            <div className="p-6 border-b border-secondary-200 dark:border-[#4d4635] bg-secondary-50 dark:bg-[#1a1712]/50 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">2. Identity Verification</h3>
                <p className="text-sm text-secondary-500 dark:text-[#d0c5af] mt-1">Verify your identity to unlock booking and listing features.</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {kycProfile?.status && kycProfile.status !== 'NOT_STARTED' && (
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold",
                    kycProfile.status === 'APPROVED' ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400" :
                    kycProfile.status === 'REJECTED' ? "bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400" :
                    "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400"
                  )}>
                    {kycProfile.status}
                  </span>
                )}
                {!isEditingKyc && (kycProfile?.status === 'UNDER_REVIEW' || kycProfile?.status === 'APPROVED') && (
                  <button onClick={() => setIsEditingKyc(true)} className="text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors bg-primary-50 px-3 py-1 rounded-md">
                    Update Details
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {!(status.isEmailVerified && status.isPhoneVerified) ? (
                <div className="text-sm text-warning-700 bg-warning-50 dark:bg-warning-900/10 p-4 rounded-lg border border-warning-200 dark:border-warning-500/20 text-center">
                  Please verify your Email and Phone Number before proceeding with Identity Verification.
                </div>
              ) : (
                <div className="space-y-6">
                  {kycProfile?.status === 'REJECTED' && (
                    <div className="text-sm text-danger-700 bg-danger-50 dark:bg-danger-900/10 p-3 rounded-lg border border-danger-200 dark:border-danger-500/20">
                      <strong>Verification Rejected:</strong> {kycProfile.rejectionReason || 'Please resubmit valid documents.'}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={kycForm.fullName || ''} 
                        onChange={e => setKycForm(prev => ({ ...prev, fullName: e.target.value }))}
                        disabled={isKycDisabled}
                        className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        placeholder="As per Aadhaar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Date of Birth</label>
                      <input 
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        value={kycForm.dateOfBirth ? new Date(kycForm.dateOfBirth).toISOString().split('T')[0] : ''} 
                        onChange={e => setKycForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        disabled={isKycDisabled}
                        className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Aadhaar Number <span className="text-secondary-400 font-normal">(Optional if PAN is provided)</span></label>
                      <input 
                        type="text" 
                        maxLength={12}
                        value={kycForm.aadhaarNumber || ''} 
                        onChange={e => setKycForm(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, '') }))}
                        disabled={isKycDisabled}
                        className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        placeholder="12 digit Aadhaar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">PAN Number <span className="text-secondary-400 font-normal">(Optional if Aadhaar is provided)</span></label>
                      <input 
                        type="text" 
                        maxLength={10}
                        value={kycForm.panNumber || ''} 
                        onChange={e => setKycForm(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                        disabled={isKycDisabled}
                        className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 uppercase"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Aadhaar Document <span className="text-secondary-400 font-normal">(Optional if PAN is provided)</span></label>
                      {kycForm.aadhaarUrl ? (
                        <div className="flex items-center justify-between p-2 border border-secondary-200 dark:border-[#4d4635] rounded-lg bg-secondary-50 dark:bg-[#1a1712]/50">
                          <a href={kycForm.aadhaarUrl} target="_blank" rel="noreferrer" className="text-sm truncate mr-2 text-primary-600 hover:underline">View Document</a>
                          {(kycProfile?.status === 'DRAFT' || kycProfile?.status === 'REJECTED' || !kycProfile?.status || kycProfile.status === 'NOT_STARTED' || isEditingKyc) && (
                            <button onClick={() => setKycForm(prev => ({ ...prev, aadhaarUrl: null }))} className="text-danger-600 hover:text-danger-700 text-sm font-medium">Remove</button>
                          )}
                        </div>
                      ) : (
                        <input 
                          type="file" 
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={e => handleFileUpload(e, 'aadhaarUrl')}
                          disabled={kycProcessing}
                          className="w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">PAN Document <span className="text-secondary-400 font-normal">(Optional if Aadhaar is provided)</span></label>
                      {kycForm.panUrl ? (
                        <div className="flex items-center justify-between p-2 border border-secondary-200 dark:border-[#4d4635] rounded-lg bg-secondary-50 dark:bg-[#1a1712]/50">
                          <a href={kycForm.panUrl} target="_blank" rel="noreferrer" className="text-sm truncate mr-2 text-primary-600 hover:underline">View Document</a>
                          {(kycProfile?.status === 'DRAFT' || kycProfile?.status === 'REJECTED' || !kycProfile?.status || kycProfile.status === 'NOT_STARTED' || isEditingKyc) && (
                            <button onClick={() => setKycForm(prev => ({ ...prev, panUrl: null }))} className="text-danger-600 hover:text-danger-700 text-sm font-medium">Remove</button>
                          )}
                        </div>
                      ) : (
                        <input 
                          type="file" 
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={e => handleFileUpload(e, 'panUrl')}
                          disabled={kycProcessing}
                          className="w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
                        />
                      )}
                    </div>
                  </div>

                  {(kycProfile?.status === 'DRAFT' || kycProfile?.status === 'REJECTED' || !kycProfile?.status || kycProfile.status === 'NOT_STARTED' || isEditingKyc) && (
                    <div className="flex gap-4 pt-4 border-t border-secondary-200">
                      {isEditingKyc ? (
                        <button 
                          onClick={() => {
                            setIsEditingKyc(false);
                            setKycForm(kycProfile || {});
                          }}
                          disabled={kycProcessing}
                          className="flex-1 bg-white dark:bg-[#110e07] hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-[#eae1d4] border border-secondary-300 dark:border-[#4d4635] font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button 
                          onClick={handleSaveDraft}
                          disabled={kycProcessing}
                          className="flex-1 bg-white dark:bg-[#110e07] hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-[#eae1d4] border border-secondary-300 dark:border-[#4d4635] font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Save Draft
                        </button>
                      )}
                      <button 
                        onClick={handleSubmitKyc}
                        disabled={kycProcessing || !isKycComplete}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isEditingKyc ? 'Update KYC' : 'Submit KYC'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 3. Live Selfie Verification */}
        {mode === 'owner' && (
          <div className="bg-white/80 dark:bg-transparent surface-glass rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-lg backdrop-blur-2xl hover:border-primary-400 dark:hover:border-[#f2ca50]/50 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(242,202,80,0.15)] transition-all duration-300 overflow-hidden mt-6">
            <div className="p-6 border-b border-secondary-200 dark:border-[#4d4635] bg-secondary-50 dark:bg-[#1a1712]/50 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">3. Live Selfie Verification</h3>
                <p className="text-sm text-secondary-500 dark:text-[#d0c5af] mt-1">Upload a real-time selfie to verify your identity.</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-bold",
                  selfieProfile?.status === 'APPROVED' ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400" :
                  selfieProfile?.status === 'UNDER_REVIEW' ? "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400" :
                  selfieProfile?.status === 'REJECTED' ? "bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400" :
                  "bg-secondary-100 dark:bg-white/10 text-secondary-700 dark:text-[#d0c5af]"
                )}>
                  {selfieProfile?.status || 'NOT_SUBMITTED'}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {(!selfieProfile?.status || selfieProfile.status === 'NOT_SUBMITTED' || selfieProfile.status === 'REJECTED') ? (
                <div className="space-y-6">
                  {selfieProfile?.status === 'REJECTED' && (
                    <div className="p-4 bg-danger-50 dark:bg-danger-900/10 text-danger-700 dark:text-danger-400 rounded-xl border border-danger-100 dark:border-danger-500/20 text-sm">
                      <span className="font-bold">Rejection Reason: </span>
                      {selfieProfile.reviewerNotes || 'Image unclear or did not match ID. Please try again.'}
                    </div>
                  )}

                  <div className="border-2 border-dashed border-secondary-300 dark:border-[#4d4635] rounded-xl p-8 text-center bg-secondary-50 dark:bg-[#1a1712]/50 hover:bg-secondary-100 dark:hover:bg-[#252119] transition-colors">
                    {selfiePreview ? (
                      <div className="flex flex-col items-center">
                        <img src={selfiePreview} alt="Selfie Preview" className="max-h-64 rounded-lg object-cover mb-4 shadow-sm border border-secondary-200" />
                        <button onClick={() => { setSelfiePreview(null); setSelfieFile(null); }} className="text-sm font-medium text-danger-600 hover:text-danger-800">
                          Remove and capture again
                        </button>
                      </div>
                    ) : isCameraOpen ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-secondary-300 shadow-sm bg-black mb-4">
                          <video ref={videoRef} autoPlay playsInline className="w-full h-auto object-cover transform scale-x-[-1]" />
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={capturePhoto}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                          >
                            <span className="text-xl">📸</span> Capture
                          </button>
                          <button 
                            onClick={stopCamera}
                            className="bg-secondary-200 hover:bg-secondary-300 text-secondary-800 font-medium py-2 px-6 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white dark:bg-[#110e07] rounded-full flex items-center justify-center mb-4 shadow-sm">
                          <span className="text-2xl">📸</span>
                        </div>
                        <p className="text-secondary-600 dark:text-[#eae1d4] mb-2 font-medium">Take a live selfie</p>
                        <p className="text-secondary-400 dark:text-[#d0c5af] text-sm mb-6">Ensure your face is well-lit and clearly visible.</p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button 
                            onClick={startCamera}
                            className="bg-primary-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Open Camera
                          </button>
                          
                          <label className="bg-white dark:bg-[#1a1712] border border-secondary-300 dark:border-[#4d4635] text-secondary-700 dark:text-[#eae1d4] font-medium py-2.5 px-6 rounded-lg cursor-pointer hover:bg-secondary-50 dark:hover:bg-[#110e07] transition-colors shadow-sm flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload File
                            <input type="file" accept="image/*" onChange={handleSelfieFileSelect} className="hidden" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex pt-2">
                    <button 
                      onClick={handleUploadSelfie}
                      disabled={selfieProcessing || !selfieFile}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {selfieProcessing ? 'Uploading...' : 'Submit Selfie'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-success-50 dark:bg-success-900/10 p-4 rounded-xl border border-success-100 dark:border-success-500/20">
                  <div className="bg-success-100 p-3 rounded-full text-success-600">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <p className="font-bold text-success-800">Selfie Submitted</p>
                    <p className="text-sm text-success-700 mt-0.5">
                      {selfieProfile.status === 'UNDER_REVIEW' ? 'Your selfie is under review by our team.' : 'Your selfie has been approved.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Payout Setup */}
        {mode === 'owner' && (
          <div className="bg-white/80 dark:bg-transparent surface-glass rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-lg backdrop-blur-2xl hover:border-primary-400 dark:hover:border-[#f2ca50]/50 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(242,202,80,0.15)] transition-all duration-300 overflow-hidden mt-6">
            <div className="p-6 border-b border-secondary-200 dark:border-[#4d4635] bg-secondary-50 dark:bg-[#1a1712]/50 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">4. Payout Setup</h3>
                <p className="text-sm text-secondary-500 dark:text-[#d0c5af] mt-1">Configure your bank account or UPI details to receive payouts.</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-bold",
                  payoutProfile?.status === 'VERIFIED' ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400" :
                  payoutProfile?.status === 'CONFIGURED' ? "bg-primary-100 text-primary-700" :
                  payoutProfile?.status === 'REJECTED' ? "bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400" :
                  "bg-secondary-100 dark:bg-white/10 text-secondary-700 dark:text-[#d0c5af]"
                )}>
                  {payoutProfile?.status || 'NOT_CONFIGURED'}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payoutMethod" 
                      value="BANK" 
                      checked={payoutForm.payoutMethod === 'BANK'}
                      onChange={() => setPayoutForm({ ...payoutForm, payoutMethod: 'BANK' })}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-secondary-900 dark:text-[#eae1d4]">Bank Account</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payoutMethod" 
                      value="UPI" 
                      checked={payoutForm.payoutMethod === 'UPI'}
                      onChange={() => setPayoutForm({ ...payoutForm, payoutMethod: 'UPI' })}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-secondary-900 dark:text-[#eae1d4]">UPI ID</span>
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Account Holder Name</label>
                    <input 
                      type="text" 
                      value={payoutForm.accountHolderName || ''}
                      onChange={(e) => setPayoutForm({ ...payoutForm, accountHolderName: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  {payoutForm.payoutMethod === 'BANK' && (
                    <>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Bank Name</label>
                        <input 
                          type="text" 
                          value={payoutForm.bankName || ''}
                          onChange={(e) => setPayoutForm({ ...payoutForm, bankName: e.target.value })}
                          className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Account Number</label>
                        <input 
                          type="password" 
                          value={payoutForm.accountNumber || ''}
                          onChange={(e) => setPayoutForm({ ...payoutForm, accountNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Confirm Account Number</label>
                        <input 
                          type="text" 
                          value={(payoutForm as any).confirmAccountNumber || ''}
                          onChange={(e) => setPayoutForm({ ...payoutForm, confirmAccountNumber: e.target.value } as any)}
                          className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">IFSC Code</label>
                        <input 
                          type="text" 
                          value={payoutForm.ifscCode || ''}
                          onChange={(e) => setPayoutForm({ ...payoutForm, ifscCode: e.target.value })}
                          className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase"
                        />
                      </div>
                    </>
                  )}

                  {payoutForm.payoutMethod === 'UPI' && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">UPI ID</label>
                      <input 
                        type="text" 
                        value={payoutForm.upiId || ''}
                        onChange={(e) => setPayoutForm({ ...payoutForm, upiId: e.target.value })}
                        placeholder="username@bank"
                        className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                </div>

                <div className="flex pt-4 border-t border-secondary-200">
                  <button 
                    onClick={async () => {
                      try {
                        await savePayoutAccount(payoutForm as any);
                        showToast.success('Payout details saved');
                        fetchStatus();
                      } catch (err: any) {
                        showToast.error(getApiErrorMessage(err));
                      }
                    }}
                    disabled={!isPayoutComplete}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Save Payout Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </PageLayout>
  );
}
