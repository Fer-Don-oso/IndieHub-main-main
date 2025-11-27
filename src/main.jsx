import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import './styles/estilo.css';
import { NotificationProvider } from './components/NotificationProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider timeout={4000} max={6}>
      <App />
    </NotificationProvider>
  </StrictMode>
);
