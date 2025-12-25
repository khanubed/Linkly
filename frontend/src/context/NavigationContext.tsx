import { createContext, PropsWithChildren, useState } from "react";

type SubscriptionPlan = 'free' | 'pro' | 'business';
type Page = 'landing' | 'signup' | 'login' | 'dashboard' | 'admin';

export const NavContext = createContext<any>(null);

export const NavProvider = ({ children }: PropsWithChildren) => {

    const [currentPage, setCurrentPage] = useState<Page>('landing');

    const navigate = (page: Page) => {
        setCurrentPage(page);
    };

  return (
    <NavContext.Provider value={{ currentPage, setCurrentPage, navigate }}>
      {children}
    </NavContext.Provider>
  );
};  