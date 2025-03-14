import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './src/App';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';


createRoot(document.getElementById('root')).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>
)


function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Oops! Something went wrong.</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Reload</button>
    </div>
  );
}

