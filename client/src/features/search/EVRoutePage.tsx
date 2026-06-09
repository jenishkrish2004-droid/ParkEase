import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { cn } from '@/lib/utils';
import { fetchEvRoute, type EVRouteResponse } from './ev-routing.service';

export default function EVRoutePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [routeData, setRouteData] = useState<EVRouteResponse | null>(null);

  useEffect(() => {
    if (!from || !to) {
      navigate('/');
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    
    fetchEvRoute(from, to)
      .then((data) => {
        if (isMounted) {
          setRouteData(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Route fetch error:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [from, to, navigate]);

  return (
    <PageLayout mainClassName="bg-secondary-50 dark:bg-transparent min-h-screen pt-8 transition-colors duration-300">
      <div className="container-app py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-10 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-[#eae1d4] flex items-center gap-3">
                <span className="material-symbols-outlined text-[32px] text-emerald-500 dark:text-emerald-400">electric_car</span>
                EV Route Planner
              </h1>
              <p className="text-secondary-500 dark:text-[#d0c5af] mt-2 text-lg">
                <strong className="text-secondary-900 dark:text-[#eae1d4]">{from}</strong>
                <span className="material-symbols-outlined text-[18px] mx-2 align-middle">arrow_forward</span>
                <strong className="text-secondary-900 dark:text-[#eae1d4]">{to}</strong>
              </p>
            </div>
            
            {routeData && !isLoading && (
              <div className="flex gap-4 bg-white dark:bg-[#1a1712] p-4 rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-sm">
                <div>
                  <p className="text-xs text-secondary-500 dark:text-[#d0c5af] font-semibold uppercase tracking-wider">Distance</p>
                  <p className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">{routeData.totalDistance} km</p>
                </div>
                <div className="w-px bg-secondary-200 dark:bg-[#4d4635]"></div>
                <div>
                  <p className="text-xs text-secondary-500 dark:text-[#d0c5af] font-semibold uppercase tracking-wider">Est. Time</p>
                  <p className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">{routeData.estimatedTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
            <p className="mt-4 text-secondary-500 dark:text-[#d0c5af] font-medium animate-pulse">Calculating optimal charging route...</p>
          </div>
        ) : !routeData ? (
          <div className="text-center py-20 bg-white dark:bg-[#1a1712] rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-warning-500 mb-4">route</span>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4]">Route Not Found</h2>
            <p className="text-secondary-500 dark:text-[#d0c5af] mt-2">We couldn't generate a route between these locations.</p>
          </div>
        ) : (
          <div className="relative pl-4 md:pl-8">
            {/* Vertical Line */}
            <div className="absolute top-8 bottom-8 left-[23px] md:left-[39px] w-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full" />

            {/* Start Node */}
            <div className="relative z-10 flex items-start gap-6 mb-10">
              <div className="w-8 h-8 rounded-full bg-white border-[3px] border-secondary-300 dark:border-secondary-600 dark:bg-[#110e07] flex-shrink-0 flex items-center justify-center mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-400 dark:bg-secondary-500"></span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">{from}</h3>
                <p className="text-sm text-secondary-500 dark:text-[#d0c5af]">Starting Point</p>
              </div>
            </div>

            {/* Charging Stations */}
            <div className="space-y-8 mb-10">
              {routeData.stops.map((stop, index) => (
                <div key={stop.id} className="relative z-10 flex items-start gap-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border-[3px] border-emerald-500 flex-shrink-0 flex items-center justify-center mt-4">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">ev_station</span>
                  </div>
                  
                  <div className="flex-1 bg-white dark:bg-[#1a1712] p-5 md:p-6 rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-sm hover:shadow-md dark:shadow-none transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">{stop.name}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-secondary-100 dark:bg-secondary-800 text-xs font-semibold text-secondary-600 dark:text-[#d0c5af]">
                            +{stop.distanceFromRoute} km from route
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-[16px] text-emerald-500">bolt</span>
                            <span className="text-secondary-700 dark:text-[#eae1d4] font-medium">{stop.chargingSpeed}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-[16px] text-secondary-400 dark:text-secondary-500">power</span>
                            <span className="text-secondary-700 dark:text-[#eae1d4]">{stop.connectorTypes.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-[16px] text-secondary-400 dark:text-secondary-500">schedule</span>
                            <span className="text-secondary-700 dark:text-[#eae1d4]">{stop.operatingHours}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className={cn("material-symbols-outlined text-[16px]", stop.payOnSpotAvailable ? "text-success-500" : "text-warning-500")}>
                              {stop.payOnSpotAvailable ? 'check_circle' : 'info'}
                            </span>
                            <span className="text-secondary-700 dark:text-[#eae1d4]">
                              {stop.payOnSpotAvailable ? 'Pay on Spot' : 'App Required'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 sm:self-center mt-2 sm:mt-0">
                        <button className="w-full sm:w-auto px-6 py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">navigation</span>
                          Navigate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* End Node */}
            <div className="relative z-10 flex items-start gap-6">
              <div className="w-8 h-8 rounded-full bg-white border-[3px] border-emerald-500 dark:bg-[#110e07] flex-shrink-0 flex items-center justify-center mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">{to}</h3>
                <p className="text-sm text-secondary-500 dark:text-[#d0c5af]">Destination</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
