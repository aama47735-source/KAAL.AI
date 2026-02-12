import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AIProvider } from "./context/AIContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ProfileProvider } from "./context/ProfileContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SmartInsightsPanel } from "./components/SmartInsightsPanel";
import { SkipNavigation } from "./components/SkipNavigation";
import { Toaster } from "sonner@2.0.3";

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ProfileProvider>
          <AIProvider>
            <div>
              <SkipNavigation />
              <RouterProvider router={router} />
              <SmartInsightsPanel />
              <Toaster 
                position="top-right" 
                richColors 
                closeButton
                toastOptions={{
                  className: 'font-sans',
                  style: {
                    fontFamily: 'Inter, sans-serif',
                  },
                }}
              />
            </div>
          </AIProvider>
        </ProfileProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}