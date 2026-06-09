import { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getApiErrorMessage } from '@/lib/api-client';
import { Card } from '@/components/ui/Card';
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
    <PageLayout showFooter={false}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-[#eae1d4] mb-6">Account Settings</h1>

        <div className="space-y-6">
          {/* Profile Overview Card */}
          <Card className="p-6">
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
          </Card>

          {/* Edit Profile Form */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-[#eae1d4] mb-4">Personal Information</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
                      <a href="/verification" className="text-primary-600 hover:text-primary-700 font-medium text-xs no-underline">
                        Add in Verification
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" isLoading={updateProfileMutation.isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password Form */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-[#eae1d4] mb-4">Security</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="flex justify-end">
                <Button type="submit" variant="outline" isLoading={updatePasswordMutation.isPending}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-danger-200 bg-danger-50">
            <h3 className="text-lg font-semibold text-danger-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-danger-700 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Account
            </Button>
          </Card>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Account"
        >
          <div className="p-6 space-y-4">
            <p className="text-sm text-secondary-600">
              Are you sure you want to delete your account? All of your data, bookings, and active sessions will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                isLoading={deleteAccountMutation.isPending}
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
