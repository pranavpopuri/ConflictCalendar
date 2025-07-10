import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from './pages/HomePage';
import Calendar from './components/Calendar';
import AuthForm from './components/AuthForm';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { useAuthStore } from './store/auth';

const App = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initializeAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "oklch(0.99 0.005 220)" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-4 rounded-full animate-spin mx-auto mb-4"
               style={{ borderColor: "oklch(0.9 0.02 220)", borderTopColor: "oklch(0.6 0.15 250)" }}></div>
          <p style={{ color: "oklch(0.5 0.08 220)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div>
                <Navbar />
                <HomePage />
                <Calendar />
              </div>
            ) : (
              <AuthForm onAuthSuccess={() => {}} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

