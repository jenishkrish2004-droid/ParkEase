import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/app/providers/AuthProvider';

export default function ParkingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <PageLayout mainClassName="bg-secondary-50 dark:bg-transparent min-h-screen pt-4 pb-20 transition-colors duration-300">
      <div className="container-app py-6">
        <Link to="/search" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-500 hover:text-primary-600 dark:text-[#d0c5af] dark:hover:text-[#f2ca50] transition-colors mb-6">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Search
        </Link>
        
        <div className="bg-white dark:bg-[#110e07] border border-secondary-200 dark:border-[#4d4635] rounded-3xl p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-6xl text-primary-500 dark:text-[#f2ca50] mb-6">local_parking</span>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-[#eae1d4] mb-4">Parking Spot Details</h1>
          <p className="text-secondary-600 dark:text-[#d0c5af] mb-8 max-w-lg mx-auto">
            You selected parking spot ID: <span className="font-mono bg-secondary-100 dark:bg-[#252119] px-2 py-1 rounded text-primary-600 dark:text-[#f2ca50] font-bold">{id}</span>.
            This page is currently a placeholder. In the future, it will contain an image gallery, detailed amenities, verified reviews, and a booking panel.
          </p>
          <button 
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login', { state: { from: location.pathname } });
              } else {
                alert('Booking process starts here...');
              }
            }}
            className="gold-glow-button px-8 py-3 rounded-xl text-white bg-primary-600 hover:bg-primary-700 dark:bg-[#f2ca50] dark:hover:bg-[#fceb96] dark:text-[#3c2f00] font-bold shadow-md"
          >
            Simulate Booking
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
