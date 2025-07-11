// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <SidebarProvider>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>

      </SidebarProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
