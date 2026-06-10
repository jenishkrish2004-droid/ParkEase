import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/app/providers/AuthProvider';
import { useState } from 'react';
import { createBooking } from './booking.service';
import { createPaymentOrder, verifyPayment } from './payment.service';
import { showToast } from '@/components/ui/Toast';

export default function ParkingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [isBooking, setIsBooking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: 'CAR',
    vehicleNumber: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16),
  });

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    setIsProcessing(true);
    try {
      const start = new Date(formData.startTime).toISOString();
      const end = new Date(formData.endTime).toISOString();
      
      const booking = await createBooking({
        parkingSpotId: id,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        startTime: start,
        endTime: end,
      });
      
      showToast.success('Booking recorded! Initiating payment...');
      
      // Step 2: Create Payment Order
      const order = await createPaymentOrder(booking.id);
      
      // Step 3: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use Razorpay Key from env
        amount: order.amount,
        currency: order.currency,
        name: "Parkora",
        description: `Booking for Spot ${id}`,
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            showToast.success('Payment successful! Booking confirmed.');
            navigate('/bookings');
          } catch (error) {
            showToast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: {
          color: "#f2ca50"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        showToast.error('Payment failed: ' + response.error.description);
      });
      rzp.open();
      
    } catch (error: any) {
      showToast.error(error.response?.data?.error || 'Failed to complete booking');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageLayout mainClassName="bg-secondary-50 dark:bg-transparent min-h-screen pt-4 pb-20 transition-colors duration-300">
      <div className="container-app py-6">
        <Link to="/search" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-500 hover:text-primary-600 dark:text-[#d0c5af] dark:hover:text-[#f2ca50] transition-colors mb-6">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Search
        </Link>
        
        <div className="bg-white dark:bg-[#110e07] border border-secondary-200 dark:border-[#4d4635] rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-6xl text-primary-500 dark:text-[#f2ca50] mb-6">local_parking</span>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-[#eae1d4] mb-4">Parking Spot Details</h1>
          <p className="text-secondary-600 dark:text-[#d0c5af] mb-8">
            You selected parking spot ID: <span className="font-mono bg-secondary-100 dark:bg-[#252119] px-2 py-1 rounded text-primary-600 dark:text-[#f2ca50] font-bold">{id}</span>.
          </p>

          {!isBooking ? (
            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: location.pathname } });
                } else {
                  setIsBooking(true);
                }
              }}
              className="gold-glow-button px-8 py-3 rounded-xl text-white bg-primary-600 hover:bg-primary-700 dark:bg-[#f2ca50] dark:hover:bg-[#fceb96] dark:text-[#3c2f00] font-bold shadow-md"
            >
              Book this Spot
            </button>
          ) : (
            <div className="text-left bg-secondary-50 dark:bg-[#1a1712] p-6 rounded-2xl border border-secondary-200 dark:border-[#4d4635] space-y-4">
              <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4] mb-4">Booking Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Vehicle Type</label>
                <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] rounded-lg">
                  <option value="CAR">Car</option>
                  <option value="BIKE">Bike</option>
                  <option value="EV">EV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Vehicle Number</label>
                <input required value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} placeholder="e.g. DL 01 AB 1234" className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Start Time</label>
                  <input type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">End Time</label>
                  <input type="datetime-local" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] rounded-lg" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button disabled={isProcessing} onClick={() => setIsBooking(false)} className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 font-medium py-2 rounded-lg transition-colors disabled:opacity-50">Cancel</button>
                <button disabled={isProcessing} onClick={handleBooking} className="flex-1 gold-glow-button text-white bg-primary-600 hover:bg-primary-700 dark:bg-[#f2ca50] dark:hover:bg-[#fceb96] dark:text-[#3c2f00] font-bold py-2 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                  {isProcessing && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
                  Confirm & Pay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
