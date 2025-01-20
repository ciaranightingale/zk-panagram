import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Polyfill for Buffer
// import { Buffer } from 'buffer';
// import crypto from 'crypto-browserify';
// import process from 'process/browser.js';  // Add .js extension here

// window.Buffer = Buffer;
// window.crypto = crypto;
// window.process = process;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
