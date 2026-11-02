import React from 'react';
import ReactDOM from 'react-dom/client'; // <--- ОБЯЗАТЕЛЬНО
import App from './App.jsx';
import { FavoritesProvider } from './component/FavoritesContext.jsx'; // <--- Ваш контекст
import './css/main.css'; // <--- Ваши глобальные стили

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </React.StrictMode>
);