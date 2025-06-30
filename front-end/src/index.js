import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId="1052357394370-307r8l78ue5a5199o2otb146mhl2o22d.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
