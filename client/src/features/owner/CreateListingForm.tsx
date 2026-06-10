import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { createParkingSpot } from './parking.service';
import { showToast } from '@/components/ui/Toast';

export default function CreateListingForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: 12.9716, // Default Bangalore
    longitude: 77.5946,
    pricePerHour: '',
    pricePerDay: '',
    pricePerMonth: '',
    totalSlots: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Upload image if exists
      let uploadedImageResult = null;
      if (imageFile) {
        const { uploadSpotImage } = await import('./parking.service');
        uploadedImageResult = await uploadSpotImage(imageFile);
      }

      // 2. Create parking spot
      await createParkingSpot({
        ...formData,
        pricePerHour: formData.pricePerHour ? Number(formData.pricePerHour) : null,
        pricePerDay: formData.pricePerDay ? Number(formData.pricePerDay) : null,
        pricePerMonth: formData.pricePerMonth ? Number(formData.pricePerMonth) : null,
        totalSlots: Number(formData.totalSlots),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        image: uploadedImageResult ? {
          url: uploadedImageResult.url,
          publicId: uploadedImageResult.publicId,
        } : undefined,
      });
      showToast.success('Parking spot created successfully!');
      navigate('/owner/listings');
    } catch (error: any) {
      showToast.error(error.response?.data?.error || 'Failed to create parking spot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout showFooter={false} mainClassName="bg-white dark:bg-[#110e07] transition-colors duration-300">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-[#eae1d4] mb-8">List Your Space</h1>
        
        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-8 rounded-2xl backdrop-blur-2xl space-y-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(242,202,80,0.1)]">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Listing Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg" placeholder="e.g. Secure Covered Parking near MG Road" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Description</label>
            <textarea required name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg" placeholder="Describe the space..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Primary Image</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-secondary-50 dark:bg-[#1a1712] border border-secondary-300 dark:border-[#4d4635] text-secondary-700 dark:text-[#eae1d4] px-4 py-2 rounded-lg hover:bg-secondary-100 transition-colors">
                Choose Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-secondary-200" />
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Street Address</label>
              <input required name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">City</label>
              <input required name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">State</label>
              <input required name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Pincode</label>
              <input required name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Total Slots Available</label>
              <input required type="number" min="1" name="totalSlots" value={formData.totalSlots} onChange={handleChange} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Price per Hour (₹)</label>
              <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-[#eae1d4] mb-1">Price per Day (₹)</label>
              <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} className="w-full px-3 py-2 border border-secondary-300 dark:border-[#4d4635] bg-transparent dark:bg-[#1a1712]/50 text-secondary-900 dark:text-[#eae1d4] rounded-lg" />
            </div>
          </div>
          
          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => navigate('/owner/listings')} className="flex-1 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 font-medium py-3 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 gold-glow-button text-white bg-primary-600 hover:bg-primary-700 font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-50">
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
