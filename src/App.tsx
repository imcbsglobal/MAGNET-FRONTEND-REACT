import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MarksView from "./pages/MarksView";
import GlobalLoader from "./components/GlobalLoader";
import SplashScreen from "./components/SplashScreen";
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
        {/* If not logged in, show Login else redirect to Marks */}
        <Route
          path="/"
          element={!token ? <Login /> : <Navigate to="/marks" replace />}
        />

        {/* If logged in, show Marks else redirect to Login */}
        <Route
          path="/marks"
          element={token ? <MarksView /> : <Navigate to="/" replace />}
        />

        {/* Optional — Catch any unknown routes */}
        <Route
          path="*"
          element={<Navigate to={token ? "/marks" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
