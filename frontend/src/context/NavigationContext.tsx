import { createContext, PropsWithChildren, useState } from "react";
import { LandingPage } from '../components/LandingPage';
import { AuthPage } from '../components/AuthPage';
import { Dashboard } from '../components/Dashboard';
import { AdminPage } from '../components/AdminPage';

type SubscriptionPlan = 'free' | 'pro' | 'business';
type Page = 'landing' | 'signup' | 'login' | 'dashboard' | 'admin';

export const NavContext = createContext<any>(null);

export const NavProvider = ({ children }: PropsWithChildren) => {

    const [currentPage, setCurrentPage] = useState<Page>('landing');

    const navigate = (page: Page) => {
        setCurrentPage(page);
    };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage  />;
      case 'signup':
        return (
          <AuthPage
            mode="signup"
          />
        );
      case 'login':
        return (
          <AuthPage
            mode="login"
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            // onUpgrade={handleUpgrade}
          />
        );
      case 'admin':
        return (
          <AdminPage
          />
        );
      default:
        return <LandingPage  />;
    }
  };


  return (
    <NavContext.Provider value={{ currentPage, setCurrentPage, navigate , renderPage}}>
      {children}
    </NavContext.Provider>
  );
};  