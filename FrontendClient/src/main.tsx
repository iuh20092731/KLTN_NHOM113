import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store.tsx';
import App from './App.tsx';
import './index.css';
import { Toaster } from "@/components/ui/toaster";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="862653012113-t4tots44rqk0omorvbbfp7h7lllhpi3q.apps.googleusercontent.com">
      <Provider store={store}>
        <Toaster />
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
