import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy Load Pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

import { Toaster } from 'react-hot-toast';

// Placeholder Components (will be replaced by actual pages)
const NotFound = () => <div className="container" style={{ padding: '2rem' }}><h1>404 Not Found</h1></div>;

function App() {
  console.log("App.jsx: Rendering..."); // DEBUG
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading (e.g. auth check, assets)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds splash screen

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="app-container">
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#800000',
              border: '1px solid #800000',
              padding: '16px',
              fontWeight: 'bold',
            },
            success: {
              iconTheme: {
                primary: '#800000',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              }
            }
          }}
        />
        { /* TEST RENDER */}
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 9999, fontSize: 10, opacity: 0.5 }}>VFE Rendered</div>
        <ErrorBoundary>
          <Suspense fallback={<SplashScreen />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="*" element={<div style={{ color: 'red', fontSize: '2rem' }}>404 IN APP ROUTES</div>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
