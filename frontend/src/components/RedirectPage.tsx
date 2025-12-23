import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL

export default function RedirectPage() {
  const { shortCode } = useParams<{ shortCode: string }>();

  useEffect(() => {
    if (!shortCode) return;
    // console.log("ShortCode " ,shortCode);
    window.location.href = `${backendURL}/api/url/resolve/${shortCode}`; // hit backend redirect directly
  }, [shortCode]);

  return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
}

