import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { cn } from '@/lib/utils';
import { fetchEvRoute, type EVRouteResponse } from './ev-routing.service';
import { EVRouteMap } from './components/EVRouteMap';

export default function EVRoutePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [routeData, setRouteData] = useState<EVRouteResponse | null>(null);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);

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
    <PageLayout 
      showFooter={false}
      className="h-screen overflow-hidden auth-theme luminous-stack"
      mainClassName="flex flex-col flex-1 min-h-0 bg-white dark:bg-[#110e07] overflow-hidden transition-colors duration-300 relative"
    >
      {/* Global Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400 dark:bg-emerald-500 opacity-10 blur-[120px] rounded-full floating-glow pointer-events-none z-0"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary-600 dark:bg-[#d4af37] opacity-10 blur-[120px] rounded-full floating-glow pointer-events-none z-0" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-emerald-300 dark:bg-emerald-400 opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full floating-glow pointer-events-none z-0" style={{ animationDelay: '-7s' }}></div>

      <div className="container-app pt-0 pb-4 sm:pb-6 max-w-[1536px] mx-auto flex-1 flex flex-col min-h-0 relative z-10">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,450px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,550px)] h-full min-h-0">
          
          {/* Left Panel: Route Details */}
          <main className="w-full h-full overflow-y-auto custom-scrollbar pr-0 lg:pr-6 pb-24 lg:pb-10 pt-4 lg:pt-6 relative">
            <div className="max-w-3xl mx-auto">
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
                  <div className="absolute top-8 bottom-8 left-[30px] md:left-[46px] w-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full" />

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
                        <div 
                          className={cn(
                            "group flex flex-col sm:flex-row sm:h-[170px] xl:h-[180px] p-2 sm:p-2.5 backdrop-blur-2xl border rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-300 cursor-pointer overflow-hidden flex-1",
                            stop.id === activeStopId
                              ? "bg-white dark:bg-[#1a2e22]/40 border-emerald-200 dark:border-emerald-500/50 scale-[1.01]"
                              : "bg-white/80 dark:bg-[#1a1712]/80 border-white dark:border-[#4d4635]/50 scale-100"
                          )}
                          onMouseEnter={() => setActiveStopId(stop.id)}
                          onMouseLeave={() => setActiveStopId(null)}
                        >
                          {/* Left Content */}
                          <div className="flex flex-1 flex-col sm:flex-row items-start p-3 gap-3 sm:gap-4 min-w-0">
                            {/* Premium Icon Box */}
                            <div className="w-full sm:w-28 h-48 sm:h-28 xl:w-32 xl:h-32 rounded-2xl sm:rounded-[1.25rem] bg-emerald-50 dark:bg-[#0f1f16] border border-emerald-200/50 dark:border-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative text-emerald-500">
                              <span className="material-symbols-outlined text-[48px] drop-shadow-sm transition-transform duration-700 group-hover:scale-110">ev_station</span>
                              {stop.id === activeStopId && (
                                <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none"></div>
                              )}
                            </div>
                            
                            <div className="flex-1 w-full mt-1 min-w-0">
                              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <h3 className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-[#eae1d4] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate min-w-0 shrink" title={stop.name}>
                                  {stop.name}
                                </h3>
                                {stop.chargingSpeed.toLowerCase().includes('fast') && (
                                  <span className="shrink-0 px-2 py-1 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">Fast Charge</span>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-600 dark:text-[#d0c5af] mb-2 sm:mb-3">
                                <span className="flex items-center gap-1 font-medium">
                                  <span className="material-symbols-outlined text-[16px]">distance</span> +{stop.distanceFromRoute} km from route
                                </span>
                                <div className="hidden sm:block w-1 h-1 rounded-full bg-secondary-300 dark:bg-[#4d4635]"></div>
                                <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">
                                  <span className="material-symbols-outlined text-[16px]">bolt</span> {stop.chargingSpeed}
                                </span>
                              </div>
                              
                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 h-[28px] overflow-hidden">
                                <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 bg-white/80 dark:bg-[#110e07]/80 text-secondary-600 dark:text-[#d0c5af] rounded-lg border border-secondary-200/50 dark:border-[#4d4635]/50 shadow-sm whitespace-nowrap">
                                  {stop.connectorTypes.join(', ')}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 bg-white/80 dark:bg-[#110e07]/80 text-secondary-600 dark:text-[#d0c5af] rounded-lg border border-secondary-200/50 dark:border-[#4d4635]/50 shadow-sm whitespace-nowrap">
                                  <span className="material-symbols-outlined text-[14px]">schedule</span> {stop.operatingHours}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 bg-white/80 dark:bg-[#110e07]/80 text-secondary-600 dark:text-[#d0c5af] rounded-lg border border-secondary-200/50 dark:border-[#4d4635]/50 shadow-sm whitespace-nowrap">
                                  <span className={cn("material-symbols-outlined text-[14px]", stop.payOnSpotAvailable ? "text-success-500" : "text-warning-500")}>
                                    {stop.payOnSpotAvailable ? 'check_circle' : 'info'}
                                  </span>
                                  {stop.payOnSpotAvailable ? 'Pay on Spot' : 'App Required'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Action Card */}
                          <div className="sm:w-[150px] xl:w-[170px] h-full shrink-0 bg-white dark:bg-[#110e07] rounded-[1.5rem] shadow-sm border border-secondary-100 dark:border-[#4d4635] p-3 flex flex-row sm:flex-col items-center sm:items-end justify-between mt-2 sm:mt-0 relative overflow-hidden group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-transparent dark:from-emerald-500/5 dark:to-transparent pointer-events-none"></div>
                            
                            <div className="text-left sm:text-right relative z-10 w-full min-w-0">
                              <div className="text-[10px] text-secondary-500 dark:text-[#d0c5af]/80 font-bold uppercase tracking-widest mb-1.5 sm:mb-2 truncate whitespace-nowrap">Est. Total</div>
                              <div className="flex items-baseline gap-1 sm:justify-end">
                                <span className="text-sm font-bold text-secondary-400 dark:text-[#d0c5af]/50">₹</span>
                                <span className="text-2xl sm:text-4xl font-black text-secondary-900 dark:text-[#eae1d4] tracking-tight">{Math.floor(stop.distanceFromRoute * 100) + 450}</span>
                              </div>
                              <div className="text-[11px] text-secondary-500 dark:text-[#d0c5af] mt-1 font-semibold">₹20/unit</div>
                            </div>
                            
                            <button className="relative z-10 w-auto sm:w-full px-6 sm:px-0 py-2 sm:py-2.5 rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 font-bold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2 mt-0 sm:mt-2">
                              <span className="material-symbols-outlined text-[18px]">navigation</span>
                              Navigate
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* End Node */}
                  <div className="relative z-10 flex items-start gap-6">
                    <div className="w-8 h-8 rounded-full bg-white border-[3px] border-primary-500 dark:bg-[#110e07] flex-shrink-0 flex items-center justify-center mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">{to}</h3>
                      <p className="text-sm text-secondary-500 dark:text-[#d0c5af]">Destination</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Right Panel: Interactive Map */}
          {routeData && !isLoading && (
            <div className="hidden lg:block w-full h-full pl-4 lg:pl-6 pt-4 lg:pt-6 border-l border-secondary-200 dark:border-[#4d4635]">
              <div className="w-full h-[calc(100%-1.5rem)]">
                <EVRouteMap routeData={routeData} activeStopId={activeStopId} />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
