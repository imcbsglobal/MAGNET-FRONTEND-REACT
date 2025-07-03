import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MarksView from "./pages/MarksView";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/SettingsPage";
import GlobalLoader from "./components/GlobalLoader";
import SplashScreen from "./components/SplashScreen";
import Attendance from "./pages/Attendance";
import { useAuthStore } from "./stores/useAuthStore";

function App() {
  const { token } = useAuthStore();
  const [checking, setChecking] = useState(true);

  // Splash screen control
  useEffect(() => {
    const timer = setTimeout(() => {
      setChecking(false);
    }, 800); // Smooth splash time

    return () => clearTimeout(timer);
  }, []);

  // While splash active
  if (checking) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <GlobalLoader />
      <Routes>
        {/* Login route → redirect to dashboard if logged in */}
        <Route
          path="/"
          element={!token ? <Login /> : <Navigate to="/dashboard" replace />}
        />

        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" replace />}
        />

        {/* Marks page */}
        <Route
          path="/marks"
          element={token ? <MarksView /> : <Navigate to="/" replace />}
        />
        {/* Attendance page */}
        <Route
          path="/attendance"
          element={token ? <Attendance /> : <Navigate to="/" replace />}
        />
        {/* Settings page */}
        <Route
          path="/settings"
          element={token ? <SettingsPage /> : <Navigate to="/" replace />}
        />

        {/* Catch-all fallback */}
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
