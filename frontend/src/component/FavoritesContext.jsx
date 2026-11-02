import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  // Имитация авторизации (в реальности - проверка токена)
  const [isAuth, setIsAuth] = useState(false);
  
  // Хранилище избранного
  const [favorites, setFavorites] = useState({
    vuzes: [],
    faculties: [],
    specialties: []
  });

  // При загрузке проверяем, авторизован ли пользователь (по токену в localStorage)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuth(true);
      // Загружаем избранное из localStorage
      const saved = localStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
    }
  }, []);

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    if (isAuth) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isAuth]);

  // Функция Входа/Выхода
  const login = () => {
    localStorage.setItem('authToken', 'fake-token-123');
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('favorites');
    setIsAuth(false);
    setFavorites({ vuzes: [], faculties: [], specialties: [] });
  };

  // Универсальная функция добавления/удаления
  const toggleFavorite = (type, item) => {
    if (!isAuth) return; // Если не авторизован, ничего не делаем

    setFavorites(prev => {
      const list = prev[type];
      const isExist = list.some(i => i.id === item.id);

      return {
        ...prev,
        [type]: isExist 
          ? list.filter(i => i.id !== item.id) // Удаляем
          : [...list, item]                    // Добавляем
      };
    });
  };

  return (
    <FavoritesContext.Provider value={{ isAuth, login, logout, favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};