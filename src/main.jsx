console.log("Main.jsx: Script Started"); // DEBUG
import { StrictMode, Suspense, Component } from 'react'
import { createRoot } from 'react-dom/client'
console.log("Main.jsx: Imports Done"); // DEBUG
import './index.css'
import App from './App.jsx'
import './i18n';
import { GlobalProvider } from './context/GlobalContext';

class SimpleErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', border: '2px solid red', margin: '20px' }}>
          <h2>Something went wrong in the App!</h2>
          <pre>{this.state.error?.toString()}</pre>
          <p>Check the console for more details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <SimpleErrorBoundary>
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0fdf4', color: '#166534', fontSize: '24px' }}>
            Loading Rent & Return Application...
          </div>
        }>
          <GlobalProvider>
            <App />
          </GlobalProvider>
        </Suspense>
      </SimpleErrorBoundary>
    </StrictMode>,
  )
} catch (e) {
  console.error("Main Render Error", e);
  document.body.innerHTML += '<h1>Render Error</h1><pre>' + e.message + '</pre>';
}
