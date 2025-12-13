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
  const [isLoading, setIsLoading] = useState(false); // DISABLED FOR DEBUGGING

  useEffect(() => {
    // Splash screen disabled
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="app-container">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#800000',
              color: '#fff',
              border: '1px solid #d4a017',
            },
            success: {
              iconTheme: {
                primary: '#d4a017',
                secondary: '#800000',
              },
            },
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
