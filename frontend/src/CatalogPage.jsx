import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SphereCard from './component/SphereCard';
import PopularBlock from './component/PopularBlock';
import CareerTestBlock from './component/CareerTestBlock';

// ИМПОРТИРУЕМ ФУНКЦИИ API
import { getSpheresWithCounts } from './api/api.js';

import './css/catalogPage.css';

export default function CatalogPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояния для данных с бекенда
  const [spheresData, setSpheresData] = useState([]);
  const [popularData, setPopularData] = useState([]); // Данные для блока "Популярное"
  const [isLoading, setIsLoading] = useState(true);

  const isSpecialties = location.pathname === '/specialties';
  const type = isSpecialties ? 'specialty' : 'profession';
  const title = isSpecialties ? 'Специальности' : 'Профессии';

  // ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Загружаем сферы с количеством
        const spheres = await getSpheresWithCounts();
        setSpheresData(spheres);
        
        // Пока для популярных используем пустой массив или заглушку
        setPopularData([]); 
        
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isSpecialties]); // Перезагружаем при смене страницы

  // Фильтрация сфер по поиску
  const spheresWithCounts = useMemo(() => {
    return spheresData.filter(sphere =>
      sphere.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, spheresData]);

  // Данные для блока "Популярное" (пока берем из состояния, которое заполним позже)
  const currentData = popularData;

  // Экран загрузки
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontSize: '24px', fontWeight: 'bold' }}>
        Загрузка каталога...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '64px 20px' }}>
      <div className='title-and-catalog'>
        <h1 className="text-32b">{title}</h1>

        <div className="catalog-grid">
          {spheresWithCounts.length > 0 ? (
            spheresWithCounts.map((sphere) => (
              <SphereCard
                key={sphere.id}
                sphere={sphere}
                count={sphere.count}
                type={type}
              />
            ))
          ) : (
            <p className="text-20r" style={{ gridColumn: '1 / -1', color: 'var(--gray)' }}>
              Ничего не найдено по запросу "{searchQuery}"
            </p>
          )}
        </div>

        {/* Блок популярных (если данные из API еще не готовы, передаем пустой массив) */}
        <PopularBlock
          items={currentData}
          title={isSpecialties ? "Популярные специальности" : "Популярные профессии"}
          type={type}
        />
        <CareerTestBlock />
      </div>
    </div>
  );
}
