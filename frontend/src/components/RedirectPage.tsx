import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function RedirectPage() {
  const { shortCode } = useParams();

  useEffect(() => {
    if (shortCode) {
      window.location.href = `${BACKEND_URL}/api/url/resolve/${shortCode}`;
    }
  }, [shortCode]);

  return <p>Redirecting...</p>;
}
