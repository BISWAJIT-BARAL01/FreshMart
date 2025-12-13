import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global Error Handler to catch "White Screen" issues at startup
window.addEventListener('error', (e) => {
    document.body.innerHTML = `<div style="padding:20px; color:red; font-family:monospace;">
        <h1>Runtime Error</h1>
        <p>${e.message}</p>
        <pre>${e.filename}:${e.lineno}</pre>
    </div>`;
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
} catch (e) {
    document.body.innerHTML = `<div style="padding:20px; color:red; font-family:monospace;">
        <h1>Initialization Error</h1>
        <p>${e}</p>
    </div>`;
}