import { useAuth } from '@/app/providers/AuthProvider';
import { useEvBusinessMode } from '@/app/providers/useParkEaseMode';
import { PageLayout } from '@/components/layout/PageLayout';
import { Checkbox } from '@/components/ui/Checkbox';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [evModeEnabled, setEvModeEnabled] = useEvBusinessMode();

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm font-medium text-secondary-500 hover:text-secondary-900 dark:text-[#b4a996] dark:hover:text-[#eae1d4] transition-colors mb-4"
          >
            <span className="material-symbols-outlined mr-1 text-[20px]">arrow_back</span>
            Back
          </button>
          <div className="flex items-center gap-4 mb-2">
            <span className="material-symbols-outlined text-primary-600 dark:text-primary-400 text-4xl">settings</span>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-[#eae1d4]">Settings</h1>
          </div>
          <p className="text-secondary-600 dark:text-[#b4a996] text-lg">Manage your account preferences and settings.</p>
        </div>

        <div className="space-y-6">
          {user?.isEvPartner && (
            <div className="bg-white dark:bg-[#110e07] border border-secondary-200 dark:border-[#4d4635] shadow-sm rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4] mb-6 border-b border-secondary-100 dark:border-[#2a2418] pb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">ev_station</span>
                EV Partner Preferences
              </h2>
              
              <label className="flex items-start gap-4 p-4 rounded-xl border border-secondary-200 dark:border-[#4d4635] hover:bg-secondary-50 dark:hover:bg-[#1a1712] cursor-pointer transition-colors">
                <div className="pt-0.5">
                  <Checkbox
                    checked={evModeEnabled}
                    onChange={(e) => setEvModeEnabled(e.target.checked)}
                  />
                </div>
                <div>
                  <span className="block text-base font-medium text-secondary-900 dark:text-[#eae1d4]">EV Business Mode</span>
                  <span className="block text-sm text-secondary-500 dark:text-[#b4a996] mt-1">
                    When enabled, your owner navigation will be tailored to EV Station Management ("EV Business") rather than general Parking Management.
                  </span>
                </div>
              </label>
            </div>
          )}

          <div className="bg-white dark:bg-[#110e07] border border-secondary-200 dark:border-[#4d4635] shadow-sm rounded-2xl p-6 sm:p-8 text-center text-secondary-500 dark:text-[#b4a996]">
            More settings coming soon.
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
