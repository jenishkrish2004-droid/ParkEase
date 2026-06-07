import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { getVerificationStatus, sendOtp, verifyOtp, type VerificationStatusResponse } from './verification.service';
import { getKycStatus, saveKycDraft, submitKyc, uploadKycDocument, type KycProfile } from './kyc.service';
import { useParkEaseMode } from '@/app/providers/useParkEaseMode';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { showToast } from '@/components/ui/Toast';
import { apiClient, getApiErrorMessage } from '@/lib/api-client';

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
  const [loading, setLoading] = useState(true);
  
  // KYC State
  const [kycForm, setKycForm] = useState<Partial<KycProfile>>({});
  const [kycProcessing, setKycProcessing] = useState(false);
  
  const hasAadhaar = Boolean(kycForm.aadhaarNumber && kycForm.aadhaarUrl);
  const hasPan = Boolean(kycForm.panNumber && kycForm.panUrl);
  const isKycComplete = Boolean(kycForm.fullName && kycForm.dateOfBirth && (hasAadhaar || hasPan));
  
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
  const [savingPhone, setSavingPhone] = useState(false);

  const emailCountdown = useTimer(0);
  const emailCooldown = useTimer(0);
  
  const phoneCountdown = useTimer(0);
  const phoneCooldown = useTimer(0);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const [data, kycData] = await Promise.all([
        getVerificationStatus(),
        getKycStatus()
      ]);
      setStatus(data);
      setKycProfile(kycData);
      setKycForm(kycData);
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


  if (loading || !status) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      </PageLayout>
    );
  }

  const progress = mode === 'booking' 
    ? ((status.isEmailVerified || status.isPhoneVerified) ? 100 : 0)
    : ((status.isEmailVerified ? 25 : 0) + (status.isPhoneVerified ? 25 : 0) + (kycProfile?.status === 'APPROVED' ? 25 : 0));

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6 py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-secondary-900">
              {mode === 'owner' ? 'Owner Verification' : 'Verification'}
            </h1>
            <p className="text-secondary-500 mt-1">
              {mode === 'owner' 
                ? 'Complete your profile verification to unlock all features.' 
                : 'Verify your email or phone number to start booking.'}
            </p>
          </div>
        </div>

        {/* Overview Card */}
        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-secondary-900">Verification Progress</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-secondary-500">Status:</span>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-bold",
                status.verificationStatus === 'APPROVED' ? "bg-success-100 text-success-700" :
                status.verificationStatus === 'PENDING' ? "bg-warning-100 text-warning-700" :
                "bg-secondary-100 text-secondary-700"
              )}>
                {status.verificationStatus}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-secondary-700">{progress}% Completed</span>
              {mode === 'owner' && <span className="text-secondary-500">Level 1</span>}
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
                <span className={status.isEmailVerified ? "text-success-500" : "text-secondary-400"}>
                  {status.isEmailVerified ? "✓" : "○"}
                </span>
                <span className={cn("text-xs font-medium", status.isEmailVerified ? "text-secondary-900" : "text-secondary-500")}>Email</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={status.isPhoneVerified ? "text-success-500" : "text-secondary-400"}>
                  {status.isPhoneVerified ? "✓" : "○"}
                </span>
                <span className={cn("text-xs font-medium", status.isPhoneVerified ? "text-secondary-900" : "text-secondary-500")}>Phone</span>
              </div>
              {mode === 'owner' && (
                <>
                  <div className="flex items-center gap-2 opacity-50">
                    <span className="text-warning-500">⏳</span>
                    <span className="text-xs font-medium text-secondary-600">Identity (Phase 6)</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50">
                    <span className="text-warning-500">⏳</span>
                    <span className="text-xs font-medium text-secondary-600">Owner (Future)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Verification Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Step 1: Email */}
          <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm relative overflow-hidden flex flex-col h-full">
            <h3 className="text-lg font-bold text-secondary-900 mb-2">1. Email Address</h3>
            <p className="text-sm text-secondary-500 mb-6">Verify your email address for account security and important updates.</p>
            
            <div className="flex-1">
              {status.isEmailVerified && !isEditingEmail ? (
                <>
                  <div className="text-sm font-medium text-secondary-900 mb-4 bg-secondary-50 p-3 rounded-lg border border-secondary-100 flex items-center justify-between">
                    <span>{user?.email}</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100 text-success-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-success-100 p-2 rounded-full">
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
                  <div className="text-sm text-secondary-600 flex justify-between items-center">
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
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:bg-secondary-50"
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
                      className="flex-1 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {emailCooldown.timeLeft > 0 ? `Resend (${emailCooldown.timeLeft}s)` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {!user?.email && (
                    <div className="text-sm text-warning-700 bg-warning-50 p-3 rounded-lg border border-warning-200">
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
                          className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
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

          {/* Step 2: Phone */}
          <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm relative overflow-hidden flex flex-col h-full">
            <h3 className="text-lg font-bold text-secondary-900 mb-2">2. Phone Number</h3>
            <p className="text-sm text-secondary-500 mb-6">Verify your phone number to enable SMS notifications and seamless bookings.</p>
            
            <div className="flex-1">
              {status.isPhoneVerified && !isEditingPhone ? (
                <>
                  <div className="text-sm font-medium text-secondary-900 mb-4 bg-secondary-50 p-3 rounded-lg border border-secondary-100 flex items-center justify-between">
                    <span>{user?.phone}</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100 text-success-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-success-100 p-2 rounded-full">
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
                  <div className="text-sm text-secondary-600 flex justify-between items-center">
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
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:bg-secondary-50"
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
                      className="flex-1 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {phoneCooldown.timeLeft > 0 ? `Resend (${phoneCooldown.timeLeft}s)` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {!user?.phone && (
                    <div className="text-sm text-warning-700 bg-warning-50 p-3 rounded-lg border border-warning-200">
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
                          className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
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
        
        {/* 3. Identity Verification */}
        {mode === 'owner' && (
          <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-secondary-200 bg-secondary-50 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-secondary-900">3. Identity Verification</h3>
                <p className="text-sm text-secondary-500 mt-1">Verify your identity to unlock booking and listing features.</p>
              </div>
              {kycProfile?.status && kycProfile.status !== 'NOT_STARTED' && (
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-bold",
                  kycProfile.status === 'APPROVED' ? "bg-success-100 text-success-700" :
                  kycProfile.status === 'REJECTED' ? "bg-danger-100 text-danger-700" :
                  "bg-warning-100 text-warning-700"
                )}>
                  {kycProfile.status}
                </span>
              )}
            </div>
            
            <div className="p-6">
              {!(status.isEmailVerified && status.isPhoneVerified) ? (
                <div className="text-sm text-warning-700 bg-warning-50 p-4 rounded-lg border border-warning-200 text-center">
                  Please verify your Email and Phone Number before proceeding with Identity Verification.
                </div>
              ) : (
                <div className="space-y-6">
                  {kycProfile?.status === 'REJECTED' && (
                    <div className="text-sm text-danger-700 bg-danger-50 p-3 rounded-lg border border-danger-200">
                      <strong>Verification Rejected:</strong> {kycProfile.rejectionReason || 'Please resubmit valid documents.'}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={kycForm.fullName || ''} 
                        onChange={e => setKycForm(prev => ({ ...prev, fullName: e.target.value }))}
                        disabled={kycProfile?.status === 'UNDER_REVIEW' || kycProfile?.status === 'APPROVED' || kycProcessing}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        placeholder="As per Aadhaar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Date of Birth</label>
                      <input 
                        type="date" 
                        value={kycForm.dateOfBirth ? new Date(kycForm.dateOfBirth).toISOString().split('T')[0] : ''} 
                        onChange={e => setKycForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        disabled={kycProfile?.status === 'UNDER_REVIEW' || kycProfile?.status === 'APPROVED' || kycProcessing}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Aadhaar Number <span className="text-secondary-400 font-normal">(Optional if PAN is provided)</span></label>
                      <input 
                        type="text" 
                        maxLength={12}
                        value={kycForm.aadhaarNumber || ''} 
                        onChange={e => setKycForm(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, '') }))}
                        disabled={kycProfile?.status === 'UNDER_REVIEW' || kycProfile?.status === 'APPROVED' || kycProcessing}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        placeholder="12 digit Aadhaar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">PAN Number <span className="text-secondary-400 font-normal">(Optional if Aadhaar is provided)</span></label>
                      <input 
                        type="text" 
                        maxLength={10}
                        value={kycForm.panNumber || ''} 
                        onChange={e => setKycForm(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                        disabled={kycProfile?.status === 'UNDER_REVIEW' || kycProfile?.status === 'APPROVED' || kycProcessing}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 uppercase"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Aadhaar Document</label>
                      {kycForm.aadhaarUrl ? (
                        <div className="flex items-center justify-between p-2 border border-secondary-200 rounded-lg bg-secondary-50">
                          <a href={kycForm.aadhaarUrl} target="_blank" rel="noreferrer" className="text-sm truncate mr-2 text-primary-600 hover:underline">View Document</a>
                          {(kycProfile?.status === 'DRAFT' || kycProfile?.status === 'REJECTED' || !kycProfile?.status || kycProfile.status === 'NOT_STARTED') && (
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
                      <label className="block text-sm font-medium text-secondary-700 mb-1">PAN Document</label>
                      {kycForm.panUrl ? (
                        <div className="flex items-center justify-between p-2 border border-secondary-200 rounded-lg bg-secondary-50">
                          <a href={kycForm.panUrl} target="_blank" rel="noreferrer" className="text-sm truncate mr-2 text-primary-600 hover:underline">View Document</a>
                          {(kycProfile?.status === 'DRAFT' || kycProfile?.status === 'REJECTED' || !kycProfile?.status || kycProfile.status === 'NOT_STARTED') && (
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

                  {(kycProfile?.status === 'DRAFT' || kycProfile?.status === 'REJECTED' || !kycProfile?.status || kycProfile.status === 'NOT_STARTED') && (
                    <div className="flex gap-4 pt-4 border-t border-secondary-200">
                      <button 
                        onClick={handleSaveDraft}
                        disabled={kycProcessing}
                        className="flex-1 bg-white hover:bg-secondary-50 text-secondary-700 border border-secondary-300 font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Save Draft
                      </button>
                      <button 
                        onClick={handleSubmitKyc}
                        disabled={kycProcessing || !isKycComplete}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Submit KYC
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Coming Soon Notice */}
        {mode === 'owner' && (
          <div className="mt-8 p-6 bg-secondary-50 rounded-2xl border border-secondary-200">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-200 text-secondary-600 text-lg">
                  🚧
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-secondary-900">Phase 7: Owner Verification</h4>
                <p className="text-sm text-secondary-500 mt-1">
                  Property ownership verification will be implemented in the next phase. Complete Identity verification first to be ready.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
