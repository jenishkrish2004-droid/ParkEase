import { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getApiErrorMessage } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { showToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { VerificationBadge } from './VerificationBadge';
import { PageLayout } from '@/components/layout/PageLayout';
import { useLogout } from '@/features/auth/hooks/useAuthMutations';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const logoutMutation = useLogout();

  // Profile Form State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.patch('/profile', data);
      return res.data;
    },
    onSuccess: async () => {
      showToast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      await refreshUser();
    },
    onError: (err) => {
      showToast.error(getApiErrorMessage(err));
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.patch('/profile/password', data);
      return res.data;
    },
    onSuccess: () => {
      showToast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (err) => {
      showToast.error(getApiErrorMessage(err));
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete('/profile');
    },
    onSuccess: () => {
      showToast.success('Account deleted successfully');
      logoutMutation.mutate();
    },
    onError: (err) => {
      showToast.error(getApiErrorMessage(err));
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ firstName: firstName.trim(), lastName: lastName.trim() });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast.error('New passwords do not match');
      return;
    }
    updatePasswordMutation.mutate({ currentPassword, newPassword });
  };

  if (!user) return null;

  return (
    <PageLayout showFooter={false} mainClassName="auth-theme luminous-stack relative flex flex-col bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] transition-colors duration-300">
      {/* Global Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-400 dark:bg-[#f2ca50] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary-600 dark:bg-[#d4af37] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-primary-300 dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-7s' }}></div>

      <div className="max-w-4xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight mb-8">
          Account Settings
        </h1>

        <div className="space-y-6">
          {/* Profile Overview Card */}
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar firstName={user.firstName} lastName={user.lastName} src={user.avatar ?? undefined} size="lg" />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4]">{user.firstName} {user.lastName}</h2>
                <p className="text-secondary-500 dark:text-[#d0c5af] mt-1">{user.email}</p>
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-sm text-secondary-600 dark:text-[#d0c5af]/80 font-medium">Status:</span>
                  <VerificationBadge status={user.verificationStatus} />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
            <h3 className="text-xl font-display font-semibold text-secondary-900 dark:text-[#eae1d4] mb-6">Personal Information</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-[#d0c5af] mb-1.5">Email Address</label>
                  <div className="px-4 py-2.5 bg-secondary-50 dark:bg-[#1a1712]/50 border border-secondary-200 dark:border-[#4d4635] rounded-xl text-secondary-500 dark:text-[#d0c5af] sm:text-sm">
                    {user.email || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-[#d0c5af] mb-1.5">Phone Number</label>
                  <div className="px-4 py-2.5 bg-secondary-50 dark:bg-[#1a1712]/50 border border-secondary-200 dark:border-[#4d4635] rounded-xl text-secondary-500 dark:text-[#d0c5af] sm:text-sm flex justify-between items-center">
                    <span>{user.phone || 'Not provided'}</span>
                    {!user.phone && (
                      <a href="/verification" className="text-primary-600 dark:text-[#f2ca50] hover:text-primary-700 dark:hover:text-[#d4af37] font-medium text-xs no-underline transition-colors">
                        Add in Verification
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={updateProfileMutation.isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
            <h3 className="text-xl font-display font-semibold text-secondary-900 dark:text-[#eae1d4] mb-6">Security</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="outline" loading={updatePasswordMutation.isPending}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-danger-50/80 dark:bg-danger-950/20 surface-glass border border-danger-200 dark:border-danger-900/50 shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
            <h3 className="text-xl font-display font-semibold text-danger-900 dark:text-danger-400 mb-2">Danger Zone</h3>
            <p className="text-sm text-danger-700 dark:text-danger-400/80 mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Account
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Account"
        >
          <div className="p-6 space-y-4">
            <p className="text-sm text-secondary-600 dark:text-[#d0c5af]">
              Are you sure you want to delete your account? All of your data, bookings, and active sessions will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={deleteAccountMutation.isPending}
                onClick={() => deleteAccountMutation.mutate()}
              >
                Yes, Delete Account
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}
