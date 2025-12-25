import { Children, createContext,useState,useContext,  PropsWithChildren, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "./AuthContext";
// import { get, set } from "mongoose";

export const AnalyticsContext = createContext< undefined>(undefined);

export const getMonthlyStats = (
  monthlyClicks: Record<string, number>
) => {
  const now = new Date();

  const currentMonthKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(
    lastMonthDate.getMonth() + 1
  ).padStart(2, "0")}`;

  const currentMonthClicks = monthlyClicks[currentMonthKey] || 0;
  const lastMonthClicks = monthlyClicks[lastMonthKey] || 0;

  let percentageChange = 0;

  if (lastMonthClicks === 0 && currentMonthClicks > 0) {
    percentageChange = 100; // new growth
  } else if (lastMonthClicks > 0) {
    percentageChange =
      ((currentMonthClicks - lastMonthClicks) / lastMonthClicks) * 100;
  }

  return {
    currentMonthClicks,
    lastMonthClicks,
    percentageChange: Number(percentageChange.toFixed(1)),
  };
};


export const AnalyticsProvider = ({children}: PropsWithChildren) => {
    const {userData} = useContext(AuthContext);

          const [analytics, setAnalytics] = useState<any>(null);
            const [deviceData, setDeviceData] = useState<any>(null);
            const [locationData, setLocationData] = useState<any>(null);
            const [referrerData, setReferrerData] = useState<any>(null);
            const [hourlyData, setHourlyData] = useState<any>(null);        
            const [topCountry, setTopCountry] = useState<any>(null);
            const [monthlyClicks , setMonthlyClicks] = useState<any>(null);

        const getEmptyAnalytics = (): any => ({
           totalClicks: 0,
           devices: {
             desktop: 0,
             mobile: 0,
             tablet: 0,
           },
       
           countries: {},
       
           sources: {
             direct: 0,
             google: 0,
             twitter: 0,
             facebook: 0,
             others: 0,
           },
       
           hourlyClicks: Array(24).fill(0),
       
           monthlyClicks: {},
         });
    
        
        const fetchAnalytics = async () => {
            try {
              const token = localStorage.getItem("token")
              if(!token) return;
            
              const { data } = await axios.get(
                `/api/url/analytics/user/${userData._id}`,
                {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
                }
              );
          
              if (!data.success)  return; 
          
              // console.log("Or kuch print krega BKL");
              transformAnalyticsForDashboard(data.analytics);
          
            //   console.log("Raw Analytics Data: ", data.analytics); 
            } catch (err) {
              console.error("Failed to load analytics");
            }
        };  

        function transformAnalyticsForDashboard(analyticsList: any[]) {
              // Empty state (important for new users)
                if (!analyticsList || analyticsList.length === 0) {
                  return getEmptyAnalytics();
                }
            
                const combined : any = {
                  totalClicks: 0,
                  devices: { desktop: 0, mobile: 0, tablet: 0 },
                  countries: {} as Record<string, number>,
                  sources: { direct: 0, google: 0, twitter: 0, facebook: 0, others: 0 },
                  hourlyClicks: Array(24).fill(0),
                  monthlyClicks: {} as Record<string, number>,
                };
            
                for (const a of analyticsList) {
                  combined.totalClicks += a.totalClicks || 0;
              
                  // Devices
                  combined.devices.desktop += a.devices?.desktop || 0;
                  combined.devices.mobile += a.devices?.mobile || 0;
                  combined.devices.tablet += a.devices?.tablet || 0;
              
                  // Countries
                  for (const country in a.countries || {}) {
                    combined.countries[country] =
                      (combined.countries[country] || 0) + a.countries[country];
                  }
              
                  // Sources
                  for (const src in a.sources || {}) {
                    combined.sources[src] += a.sources[src];
                  }
              
                  // Hourly
                  a.hourlyClicks?.forEach((count: number, hour: number) => {
                    combined.hourlyClicks[hour] += count;
                  });
              
                  // Monthly
                  for (const month in a.monthlyClicks || {}) {
                    combined.monthlyClicks[month] =
                      (combined.monthlyClicks[month] || 0) + a.monthlyClicks[month];
                  }
                }
                // console.log("Combined Analytics: ", combined);
                setAnalytics(combined);
                transformForFrontend(combined);
            }

            const transformForFrontend =  (data: any) => {
                  const total = data.totalClicks || 1;

                  /* ---------- Device Data ---------- */
                 setDeviceData([
                    { name: "Desktop", value: (data.devices.desktop / (data.devices.desktop + data.devices.mobile + data.devices.tablet))*100, color: "#00BCD4" },
                    { name: "Mobile", value: (data.devices.mobile / (data.devices.desktop + data.devices.mobile + data.devices.tablet))*100, color: "#26C6DA" },
                    { name: "Tablet", value: (data.devices.tablet / (data.devices.desktop + data.devices.mobile + data.devices.tablet))*100, color: "#4DD0E1" },
                  ]);

                  /* ---------- Location Data ---------- */
                  const locationData = Object.entries(data.countries).map(
                    ([country, clicks]: any) => ({
                      country,
                      clicks,
                      percentage: Math.round((clicks / total) * 100),
                    })
                  );
               
                  /* ---------- Referrer Data ---------- */
                  const referrerData = Object.entries(data.sources).map(
                    ([name, clicks]: any) => ({
                      name: name.charAt(0).toUpperCase() + name.slice(1),
                      clicks,
                      percentage: Math.round((clicks / total) * 100),
                    })
                  );
               
                  /* ---------- Hourly Data ---------- */
                  const hourlyData = data.hourlyClicks.map((clicks: number, hour: number) => ({
                    hour: hour.toString().padStart(2, "0"),
                    clicks,
                  }));
               
                 setLocationData(locationData);
                 setReferrerData(referrerData);
                 setHourlyData(hourlyData); 
                 
                if (!locationData || locationData.length === 0) {
                  setTopCountry({ country: "-", percentage: 0 });
                }
                /* ---------- Top Country ---------- */
                const filtered = locationData.filter(c => c.country !== "Unknown");
                const source = filtered.length > 0 ? filtered : locationData;
            
                const top = source.reduce((max, curr) =>
                  curr.clicks > max.clicks ? curr : max
                );
            
                setTopCountry(top);
                setMonthlyClicks(getMonthlyStats(data.monthlyClicks));
                // console.log("Monthly Clicks: ", getMonthlyStats(data.monthlyClicks));
                /* ---------- Monthly Clicks ---------- */

            }; 

    const value : any = {
        fetchAnalytics , transformAnalyticsForDashboard  , deviceData, locationData, referrerData, hourlyData  , analytics , setAnalytics , topCountry  , monthlyClicks
    }

    return(
        <AnalyticsContext.Provider value =  { value }>
            {children}
        </AnalyticsContext.Provider>
    )
}