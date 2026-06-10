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
          Join thousands of hosts earning money by listing their unused parking spots on Parkora.
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

        <div className="flex justify-center mt-12 mb-12 relative z-10">
          <button 
            className="gold-glow-button px-10 py-4 rounded-2xl text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-[#3c2f00] font-bold text-lg transition-all shadow-xl shadow-primary-500/20 hover:scale-105" 
            onClick={() => navigate('/verification')}
          >
            Register Now
          </button>
        </div>

        {/* EV Section Title */}
        <div className="mt-24 text-center relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.2)] border border-green-200 dark:border-green-800/30">
              <span className="material-symbols-outlined text-3xl">electric_bolt</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 dark:from-green-300 dark:to-green-500 tracking-tight">
              Power the EV Revolution
            </h2>
          </div>
          <p className="text-lg text-secondary-500 dark:text-[#d0c5af] max-w-2xl mx-auto mb-12">
            Connect your charging stations with thousands of electric vehicle drivers searching for their next charge on Parkora EV.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4 text-xl border border-transparent dark:border-green-500/20">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">handshake</span>
              </div>
              <h3 className="font-display font-bold text-secondary-900 dark:text-[#eae1d4] mb-2 text-lg">Partner With Us</h3>
              <p className="text-secondary-500 dark:text-[#d0c5af] text-sm">Own a charging station? Partner with Parkora EV and join our fast-growing network of operators.</p>
            </div>
            <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4 text-xl border border-transparent dark:border-green-500/20">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">explore</span>
              </div>
              <h3 className="font-display font-bold text-secondary-900 dark:text-[#eae1d4] mb-2 text-lg">Get Discovered</h3>
              <p className="text-secondary-500 dark:text-[#d0c5af] text-sm">Get discovered by EV travelers across India searching for their next reliable charge on our platform.</p>
            </div>
            <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4 text-xl border border-transparent dark:border-green-500/20">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">trending_up</span>
              </div>
              <h3 className="font-display font-bold text-secondary-900 dark:text-[#eae1d4] mb-2 text-lg">Maximize Utilization</h3>
              <p className="text-secondary-500 dark:text-[#d0c5af] text-sm">Our network helps EV operators maximize station utilization, attract more drivers, and boost earnings.</p>
            </div>
          </div>

          <div className="flex justify-center relative z-10 w-full mb-8">
            <button 
              className="px-10 py-4 rounded-2xl text-white bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 dark:text-[#0b1711] font-bold text-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-105" 
              onClick={() => navigate('/owner/ev-partnership')}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
