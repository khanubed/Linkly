
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { UrlProvider } from "./context/UrlContext.tsx";
import { AnalyticsProvider } from "./context/AnalyticsContext.tsx";
import { AdminContext, AdminProvider } from "./context/AdminContext.tsx";
import { NavProvider } from "./context/NavigationContext.tsx";
import { PaymentProvider } from "./context/PaymentContext.tsx";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
    <NavProvider>
      <AuthProvider>
        <UrlProvider>
          <AnalyticsProvider>
            <PaymentProvider>
            <AdminProvider>
              <App/>
            </AdminProvider>
            </PaymentProvider>
          </AnalyticsProvider>          
       </UrlProvider>
      </AuthProvider>
      </NavProvider>
    </BrowserRouter>
  );