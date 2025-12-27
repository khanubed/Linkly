import { createContext , PropsWithChildren, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

import { User as UserData } from "./AuthContext";
import { NavContext } from "./NavigationContext";

export interface UrlData {
  _id: string;          // MongoDB document id (optional on frontend)
  userId: string;        // ObjectId as string
  originalUrl: string;
  shortUrl: string;
  visits: number;
  createdAt: string;       // ISO date string
  clickHistory: string[]; // array of timestamps or IPs (depending on backend)
}

export interface UrlAnalytics {
  totalClicks: number;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  countries: Record<string, number>;
  sources: {
    direct: number;
    google: number;
    twitter: number;
    facebook: number;
    others: number;
  };
  hourlyClicks: number[]; // length 24
}


export const UrlContext = createContext<any>(null)

export const UrlProvider = ( {children} : PropsWithChildren ) => {
    const [showPricingModal, setShowPricingModal] = useState(false); 
    const { navigate : onNavigate} = useContext(NavContext)
    const {userData , setUserData , isAdmin , } = useContext(AuthContext)
    const [urls, setUrls] = useState<UrlData[]>([]);


    // Create Short Link
    
  const handleLinkCreated = async ( urlInput : string, customAlias : string) => {
        try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { data } = await axios.post(
      "/api/url/shorten",
      {
        originalUrl: urlInput,
        customAlias: customAlias || undefined,
        userId: userData._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      // 1️⃣ Add new URL from backend
      setUrls((prev) => [data.url, ...prev]);

      // 2️⃣ Update user data (linksCreated)
      setUserData(data.userData);
      toast.success("Short URL created successfully 🎉");
    }
  } catch (error: any) {
    if (error.response?.status === 403) {
      setShowPricingModal(true);
    } else {
      toast.error(
        error.response?.data?.message || "Failed to create short URL"
      );
    }
  }         
  };

  // Delete Short Link

const handleDeleteUrl = async (urlId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { data } = await axios.delete(`/api/url/${urlId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userId: userData._id, // required by backend
      },
    });

    if (data.success) {
      // Remove URL from UI
      setUrls((prev : UrlData[]) => prev.filter((url) => url._id !== urlId));

      // Update user links count
      setUserData((prev : UserData | null) =>
        prev
          ? {
              ...prev,
              linksCreated: Math.max(prev.linksCreated - 1, 0),
            }
          : prev
      );

      toast.success("URL deleted successfully");
    }
  } catch (error) {
    toast.error("Failed to delete URL");
  }
};


// Fetch User's URLs

     const fetchUrls = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
        
          const { data } = await axios.get(`/api/url/user/${userData._id}`);
        
          if (data.success) {
            setUrls(data.urls);
          }
        } catch (error) {
          console.error("Failed to fetch URLs");
        }
    };

    // Get Links Limit & Remaining

      const getLinksLimit = () => {
        switch (userData.subscriptionPlan) {
          case 'pro':
            return 1000;
          case 'business':
            return Infinity;
          default:
            return 10;
        }
      };

        const getLinksRemaining = () => {
          const limit = getLinksLimit();
          if (limit === Infinity) return Infinity;
          return Math.max(0, limit - userData.linksCreated);
        };


    const value = { handleLinkCreated , urls , setUrls , setShowPricingModal , showPricingModal , handleDeleteUrl , fetchUrls , getLinksLimit , getLinksRemaining  }

    return (
        <UrlContext.Provider value={value}>
            {children}
          </UrlContext.Provider>
      )
  }