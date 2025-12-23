
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { UrlProvider } from "./context/UrlContext.tsx";
import { AnalyticsProvider } from "./context/AnalyticsContext.tsx";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <AuthProvider>
        <UrlProvider>
          <AnalyticsProvider>
            <App />
          </AnalyticsProvider>          
       </UrlProvider>
      </AuthProvider>
    </BrowserRouter>
  );