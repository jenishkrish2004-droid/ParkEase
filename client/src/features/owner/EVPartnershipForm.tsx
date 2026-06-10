import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { evPartnershipApplicationSchema, type EVPartnershipApplicationPayload } from '@parkora/shared';
import apiClient, { getApiErrorMessage } from '@/lib/api-client';


import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { TextArea } from '@/components/ui/TextArea';
import toast from 'react-hot-toast';

export default function EVPartnershipForm() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EVPartnershipApplicationPayload>({
    resolver: zodResolver(evPartnershipApplicationSchema) as any,
    defaultValues: {
      businessName: '',
      contactPerson: '',
      phoneNumber: '',
      emailAddress: '',
      stationName: '',
      fullAddress: '',
      googleMapsLocation: '',
      numberOfPoints: 1,
      connectorTypes: [],
      chargingSpeedKw: 0,
      operatingHours: '',
      parkingAvailable: false,
      amenities: [],
      additionalNotes: '',
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: EVPartnershipApplicationPayload) => {
      const response = await apiClient.post('/partnerships/ev', data);
      return response.data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || 'Failed to submit application');
    },
  });

  const onSubmit = (data: EVPartnershipApplicationPayload) => {
    submitMutation.mutate(data);
  };

  const connectorOptions = ['Type 2', 'CCS2', 'CHAdeMO', 'Type 1', 'GB/T'];
  const amenityOptions = ['Waiting Lounge', 'Restrooms', 'Food & Beverages', 'Wi-Fi', 'CCTV'];

  if (isSubmitted) {
    return (
      <>
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
          <div className="bg-white dark:bg-[#110e07] border border-secondary-200 dark:border-[#4d4635] shadow-xl rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-[#eae1d4] mb-4">
              Application Submitted Successfully
            </h2>
            <p className="text-lg text-secondary-600 dark:text-[#b4a996] mb-8">
              Thank you for your interest in partnering with Parkora EV. Our team will review your station details and contact you directly to complete the onboarding process.
            </p>

            <div className="inline-block bg-secondary-50 dark:bg-[#1a1712] rounded-xl px-6 py-3 border border-secondary-200 dark:border-[#4d4635] mb-12">
              <span className="text-sm font-medium text-secondary-500 dark:text-[#b4a996] mr-2">Status:</span>
              <span className="text-sm font-bold text-primary-600 dark:text-[#f2ca50]">Under Review</span>
            </div>

            <div className="text-left max-w-md mx-auto">
              <h3 className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4] mb-6">Next Steps</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                  <span className="text-secondary-700 dark:text-[#d0c5af]">Application Received</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-300 dark:text-[#4d4635] text-xl">radio_button_unchecked</span>
                  <span className="text-secondary-700 dark:text-[#d0c5af]">Initial Review</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-300 dark:text-[#4d4635] text-xl">radio_button_unchecked</span>
                  <span className="text-secondary-700 dark:text-[#d0c5af]">Team Contact</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-300 dark:text-[#4d4635] text-xl">radio_button_unchecked</span>
                  <span className="text-secondary-700 dark:text-[#d0c5af]">Station Verification</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-300 dark:text-[#4d4635] text-xl">radio_button_unchecked</span>
                  <span className="text-secondary-700 dark:text-[#d0c5af]">Activation on Parkora EV</span>
                </li>
              </ul>
            </div>

            <div className="mt-12">
              <Button onClick={() => navigate('/owner')} size="lg" className="w-full sm:w-auto">
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-secondary-500 hover:text-secondary-900 dark:text-[#b4a996] dark:hover:text-[#eae1d4] transition-colors mb-4">
            <span className="material-symbols-outlined mr-1 text-[20px]">arrow_back</span>
            Back to Onboarding
          </button>
          <div className="flex items-center gap-4 mb-2">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">ev_station</span>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-[#eae1d4]">EV Partnership Application</h1>
          </div>
          <p className="text-secondary-600 dark:text-[#b4a996] text-lg">Partner with Parkora EV and list your charging station on our network.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Business Information */}
          <div className="bg-white dark:bg-[#110e07] border border-secondary-200 dark:border-[#4d4635] shadow-sm rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4] mb-6 border-b border-secondary-100 dark:border-[#2a2418] pb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Business Name"
                placeholder="e.g. GreenCharge Solutions"
                {...register('businessName')}
                error={errors.businessName?.message}
              />
              <Input
                label="Contact Person"
                placeholder="Full Name"
                {...register('contactPerson')}
                error={errors.contactPerson?.message}
              />
              <Input
                label="Phone Number"
                placeholder="10-digit mobile number"
                {...register('phoneNumber')}
                error={errors.phoneNumber?.message}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="Business email"
                {...register('emailAddress')}
                error={errors.emailAddress?.message}
              />
            </div>
          </div>

          {/* Station Information */}
          <div className="bg-white dark:bg-[#110e07] border border-secondary-200 dark:border-[#4d4635] shadow-sm rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4] mb-6 border-b border-secondary-100 dark:border-[#2a2418] pb-4">Station Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Station Name"
                placeholder="e.g. GreenCharge Hub - Koramangala"
                {...register('stationName')}
                error={errors.stationName?.message}
              />
              <Input
                label="Operating Hours"
                placeholder="e.g. 24/7 or 9 AM - 9 PM"
                {...register('operatingHours')}
                error={errors.operatingHours?.message}
              />
            </div>
            
            <div className="space-y-6">
              <Input
                label="Full Address"
                placeholder="Complete street address"
                {...register('fullAddress')}
                error={errors.fullAddress?.message}
              />
              <Input
                label="Google Maps URL"
                placeholder="https://maps.google.com/..."
                {...register('googleMapsLocation')}
                error={errors.googleMapsLocation?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Input
                label="Number of Charging Points"
                type="number"
                min="1"
                {...register('numberOfPoints', { valueAsNumber: true })}
                error={errors.numberOfPoints?.message}
              />
              <Input
                label="Charging Speed (kW)"
                type="number"
                step="0.1"
                min="0.1"
                {...register('chargingSpeedKw', { valueAsNumber: true })}
                error={errors.chargingSpeedKw?.message}
              />
            </div>

            <div className="mt-8">
              <label className="block text-sm font-medium text-secondary-700 dark:text-[#d0c5af] mb-3">Connector Types</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {connectorOptions.map((connector) => (
                  <Controller
                    key={connector}
                    name="connectorTypes"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-secondary-200 dark:border-[#4d4635] hover:bg-secondary-50 dark:hover:bg-[#1a1712] cursor-pointer transition-colors">
                        <Checkbox
                          checked={field.value.includes(connector)}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, connector]);
                            } else {
                              field.onChange(field.value.filter((val: string) => val !== connector));
                            }
                          }}
                        />
                        <span className="text-sm font-medium text-secondary-900 dark:text-[#eae1d4]">{connector}</span>
                      </label>
                    )}
                  />
                ))}
              </div>
              {errors.connectorTypes && <p className="mt-2 text-sm text-red-500">{errors.connectorTypes.message}</p>}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white dark:bg-[#110e07] border border-secondary-200 dark:border-[#4d4635] shadow-sm rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4] mb-6 border-b border-secondary-100 dark:border-[#2a2418] pb-4">Additional Information</h2>
            
            <div className="mb-8">
              <Controller
                name="parkingAvailable"
                control={control}
                render={({ field }) => (
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-secondary-200 dark:border-[#4d4635] hover:bg-secondary-50 dark:hover:bg-[#1a1712] cursor-pointer transition-colors">
                    <div className="pt-0.5">
                      <Checkbox
                        checked={field.value}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                      />
                    </div>
                    <div>
                      <span className="block text-base font-medium text-secondary-900 dark:text-[#eae1d4]">General Parking Available</span>
                      <span className="block text-sm text-secondary-500 dark:text-[#b4a996] mt-1">Check this if non-EV vehicles can also park at this location</span>
                    </div>
                  </label>
                )}
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-secondary-700 dark:text-[#d0c5af] mb-3">Available Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenityOptions.map((amenity) => (
                  <Controller
                    key={amenity}
                    name="amenities"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-secondary-200 dark:border-[#4d4635] hover:bg-secondary-50 dark:hover:bg-[#1a1712] cursor-pointer transition-colors">
                        <Checkbox
                          checked={field.value.includes(amenity)}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, amenity]);
                            } else {
                              field.onChange(field.value.filter((val: string) => val !== amenity));
                            }
                          }}
                        />
                        <span className="text-sm font-medium text-secondary-900 dark:text-[#eae1d4]">{amenity}</span>
                      </label>
                    )}
                  />
                ))}
              </div>
            </div>

            <div>
              <TextArea
                label="Additional Notes"
                placeholder="Any other details you'd like to share about your station..."
                rows={4}
                {...register('additionalNotes')}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto min-w-[200px]"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
