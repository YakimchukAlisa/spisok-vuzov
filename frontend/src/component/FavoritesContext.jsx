import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

const API_BASE = 'http://localhost:8080/api/favorites';

// Моки — только как фолбэк, если бэкенд недоступен
const MOCK_FAVORITES = {
  vuzes: [],
  faculties: [],
  specialties: []
};

const TYPES = {
  vuzes: 'vuz',
  faculties: 'fak',
  specialties: 'naprav'
};

export const FavoritesProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState({ vuzes: [], faculties: [], specialties: [] });
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const uid = localStorage.getItem('userId');
    const parsed = Number(uid);
    if (token && uid && !Number.isNaN(parsed) && parsed > 0) {
      setIsAuth(true);
      setUserId(parsed);
    }
  }, []);

  // Загрузка избранного с бэкенда
  useEffect(() => {
    if (!isAuth || !userId) return;

    Promise.all([
      fetch(`${API_BASE}/vuz/${userId}`).then(r => (r.ok ? r.json() : Promise.reject())),
      fetch(`${API_BASE}/fak/${userId}`).then(r => (r.ok ? r.json() : Promise.reject())),
      fetch(`${API_BASE}/naprav/${userId}`).then(r => (r.ok ? r.json() : Promise.reject()))
    ])
      .then(([vuzes, faculties, specialties]) => {
        setFavorites({
          vuzes: Array.isArray(vuzes) ? vuzes : vuzes?.data ?? [],
          faculties: Array.isArray(faculties) ? faculties : faculties?.data ?? [],
          specialties: Array.isArray(specialties) ? specialties : specialties?.data ?? []
        });
        setUseMock(false);
      })
      .catch(() => {
        setUseMock(true);
        const saved = localStorage.getItem('favorites');
        setFavorites(saved ? JSON.parse(saved) : MOCK_FAVORITES);
      });
  }, [isAuth, userId]);

  // В mock-режиме сохраняем локально
  useEffect(() => {
    if (useMock) localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites, useMock]);

  const login = (uid) => {
    const id = Number(uid);
    if (uid == null || uid === '' || Number.isNaN(id) || id <= 0) {
      console.warn('login вызван без userId — избранное не загрузится');
      localStorage.removeItem('userId');
      localStorage.setItem('authToken', 'fake-token-123');
      setIsAuth(true);
      setUserId(null);
      return;
    }
    localStorage.setItem('authToken', 'fake-token-123');
    localStorage.setItem('userId', String(id));
    setIsAuth(true);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsAuth(false);
    setUserId(null);
    setFavorites({ vuzes: [], faculties: [], specialties: [] });
  };

  const toggleFavorite = (type, item) => {
    if (!isAuth || !userId) return;

    const apiType = TYPES[type];
    const list = favorites[type] ?? [];
    const matches = (i) => (i[`${apiType}Id`] ?? i.id) === item.id;
    const exists = list.some(matches);

    // Оптимистичное обновление UI
    setFavorites(prev => ({
      ...prev,
      [type]: exists ? prev[type].filter(i => !matches(i)) : [...prev[type], item]
    }));

    if (useMock) return;

    const url = `${API_BASE}/${apiType}?userId=${userId}&${apiType}Id=${item.id}`;
    fetch(url, { method: exists ? 'DELETE' : 'POST' })
      .then(r => { if (!r.ok) throw new Error(r.status); })
      .catch(() => {
        setFavorites(prev => ({
          ...prev,
          [type]: exists ? [...prev[type], item] : prev[type].filter(i => !matches(i))
        }));
      });
  };


  return (
    <FavoritesContext.Provider value={{ isAuth, login, logout, favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
