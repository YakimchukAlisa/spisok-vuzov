import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

const MOCK_FAVORITES = {
  vuzes: [
    { 
      id: 1, 
      name: "АлтГТУ им. И. И. Ползунова", 
      fullName: "Алтайский государственный технический университет", 
      imageUrl: "/img/altgtu.jpg", 
      budget: { places: 1076, minScore: 39 }, 
      paid: { places: 940, minScore: 39, minPrice: 80000 } 
    }
  ],
  faculties: [
    {
      id: 1,
      vuzId: 1,
      shortName: "ФИТ",
      fullName: "Факультет Информационных технологий",
      imageUrl: "/fit.svg",
      workPlaces: ["Профильные компании", "IT-отделы"],
      bachelor: { directions: 6, budgetPlaces: 303, paidPlaces: 195, minPrice: 160000 },
      master: { directions: 4, budgetPlaces: 51, paidPlaces: 60, minPrice: 170000 }
    }
  ],
  specialties: []
};

export const FavoritesProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  
  // Инициализируем из localStorage или заглушек
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : MOCK_FAVORITES;
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) setIsAuth(true);
  }, []);

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const login = () => {
    localStorage.setItem('authToken', 'fake-token-123');
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    // При выходе НЕ удаляем избранное, чтобы оно осталось (или удаляем, если хотите)
    setIsAuth(false);
  };

  const toggleFavorite = (type, item) => {
    if (!isAuth) return;

    setFavorites(prev => {
      const list = prev[type];
      const isExist = list.some(i => i.id === item.id);

      return {
        ...prev,
        [type]: isExist 
          ? list.filter(i => i.id !== item.id)
          : [...list, item]
      };
    });
  };

  return (
    <FavoritesContext.Provider value={{ isAuth, login, logout, favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};