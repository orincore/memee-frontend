import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
// Alternative for deployment without server configuration:
// import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* Alternative for deployment:
    <HashRouter>
      <App />
    </HashRouter>
    */}
  </StrictMode>
);
