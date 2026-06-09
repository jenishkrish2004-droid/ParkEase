import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function OwnerOnboarding() {
  const navigate = useNavigate();

  return (
    <PageLayout showFooter={false} mainClassName="auth-theme luminous-stack relative flex flex-col bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] transition-colors duration-300">
      {/* Global Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-400 dark:bg-[#f2ca50] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary-600 dark:bg-[#d4af37] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-primary-300 dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-7s' }}></div>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-20 h-20 bg-primary-100 dark:bg-[#f2ca50]/10 text-primary-600 dark:text-[#f2ca50] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(242,202,80,0.2)]">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight mb-4">Turn your empty space into earnings</h1>
        <p className="text-xl text-secondary-500 dark:text-[#d0c5af] max-w-2xl mx-auto mb-10">
          Join thousands of hosts earning money by listing their unused parking spots on ParkEase.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 text-xl border border-transparent dark:border-blue-500/20">💸</div>
            <h3 className="font-display font-bold text-secondary-900 dark:text-[#eae1d4] mb-2 text-lg">Steady Earnings</h3>
            <p className="text-secondary-500 dark:text-[#d0c5af] text-sm">Set your own price per hour, day, or month. Get paid securely through our platform.</p>
          </div>
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4 text-xl border border-transparent dark:border-green-500/20">🛡️</div>
            <h3 className="font-display font-bold text-secondary-900 dark:text-[#eae1d4] mb-2 text-lg">Verified Guests</h3>
            <p className="text-secondary-500 dark:text-[#d0c5af] text-sm">Every user is verified. We provide 24/7 support and host protection guarantees.</p>
          </div>
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4 text-xl border border-transparent dark:border-purple-500/20">🕒</div>
            <h3 className="font-display font-bold text-secondary-900 dark:text-[#eae1d4] mb-2 text-lg">Total Control</h3>
            <p className="text-secondary-500 dark:text-[#d0c5af] text-sm">Set your own availability schedule. Block out times when you need the spot for yourself.</p>
          </div>
        </div>

        <div className="p-8 sm:p-10 bg-white/80 dark:bg-[#110e07]/80 surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl rounded-2xl backdrop-blur-xl text-left relative overflow-hidden">
          <div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-primary-500 dark:bg-[#d4af37] opacity-10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <h2 className="text-2xl font-display font-bold mb-4 text-secondary-900 dark:text-[#eae1d4] relative z-10">Verification Requirements</h2>
          <p className="text-secondary-500 dark:text-[#d0c5af] mb-6 relative z-10">To maintain a safe community, we require the following before you can publish a listing:</p>
          <ul className="space-y-4 mb-8 relative z-10">
            <li className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary-50 dark:bg-[#1a1712] border border-primary-200 dark:border-[#4d4635] flex items-center justify-center text-sm font-bold text-primary-600 dark:text-[#f2ca50]">1</span>
              <span className="font-medium text-secondary-900 dark:text-[#eae1d4]">Contact Details (Email & Phone)</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary-50 dark:bg-[#1a1712] border border-primary-200 dark:border-[#4d4635] flex items-center justify-center text-sm font-bold text-primary-600 dark:text-[#f2ca50]">2</span>
              <span className="font-medium text-secondary-900 dark:text-[#eae1d4]">Identity Verification (Government ID)</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary-50 dark:bg-[#1a1712] border border-primary-200 dark:border-[#4d4635] flex items-center justify-center text-sm font-bold text-primary-600 dark:text-[#f2ca50]">3</span>
              <span className="font-medium text-secondary-900 dark:text-[#eae1d4]">Selfie Verification (Liveness check)</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary-50 dark:bg-[#1a1712] border border-primary-200 dark:border-[#4d4635] flex items-center justify-center text-sm font-bold text-primary-600 dark:text-[#f2ca50]">4</span>
              <span className="font-medium text-secondary-900 dark:text-[#eae1d4]">Bank Account Details for Payouts</span>
            </li>
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button className="gold-glow-button px-8 py-3.5 rounded-xl text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-[#3c2f00] font-semibold text-base transition-all shadow-md" onClick={() => navigate('/owner/dashboard')}>
              Go to Owner Dashboard
            </button>
            <Button variant="outline" size="lg" className="border-secondary-200 text-secondary-700 hover:bg-secondary-50 dark:border-[#4d4635] dark:text-[#d0c5af] dark:hover:bg-white/5 dark:hover:text-[#eae1d4]">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
