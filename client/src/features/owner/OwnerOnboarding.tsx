import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function OwnerOnboarding() {
  const navigate = useNavigate();

  return (
    <PageLayout showFooter={false}>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">Turn your empty space into earnings</h1>
        <p className="text-xl text-secondary-500 max-w-2xl mx-auto mb-10">
          Join thousands of hosts earning money by listing their unused parking spots on ParkEase.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <Card className="p-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-xl">💸</div>
            <h3 className="font-bold text-secondary-900 mb-2">Steady Earnings</h3>
            <p className="text-secondary-500 text-sm">Set your own price per hour, day, or month. Get paid securely through our platform.</p>
          </Card>
          <Card className="p-6">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 text-xl">🛡️</div>
            <h3 className="font-bold text-secondary-900 mb-2">Verified Guests</h3>
            <p className="text-secondary-500 text-sm">Every user is verified. We provide 24/7 support and host protection guarantees.</p>
          </Card>
          <Card className="p-6">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 text-xl">🕒</div>
            <h3 className="font-bold text-secondary-900 mb-2">Total Control</h3>
            <p className="text-secondary-500 text-sm">Set your own availability schedule. Block out times when you need the spot for yourself.</p>
          </Card>
        </div>

        <Card className="p-8 bg-secondary-900 text-white text-left">
          <h2 className="text-2xl font-bold mb-4">Verification Requirements</h2>
          <p className="text-secondary-300 mb-6">To maintain a safe community, we require the following before you can publish a listing:</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-secondary-700 flex items-center justify-center text-sm">1</span>
              <span>Identity Verification (Aadhaar / PAN)</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-secondary-700 flex items-center justify-center text-sm">2</span>
              <span>Property Ownership Proof or NOC</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-secondary-700 flex items-center justify-center text-sm">3</span>
              <span>Bank Account Details for Payouts</span>
            </li>
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/owner/dashboard')}>
              Go to Owner Dashboard
            </Button>
            <Button variant="outline" size="lg" className="border-secondary-600 text-secondary-300 hover:bg-secondary-800">
              Learn More
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
