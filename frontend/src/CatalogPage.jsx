import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import professionsData from './DATA/professions.json';
import spheresData from './DATA/spheres.json';
import vuzData from './DATA/cardVuz.json';
import SphereCard from './component/SphereCard';
import PopularBlock from './component/PopularBlock';
import CareerTestBlock from './component/CareerTestBlock';
import './css/catalogPage.css';

export default function CatalogPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const isSpecialties = location.pathname === '/specialties';
  const type = isSpecialties ? 'specialty' : 'profession';
  const title = isSpecialties ? 'Специальности' : 'Профессии';

  // 1. СОБИРАЕМ СПЕЦИАЛЬНОСТИ ИЗ ВУЗОВ (только если мы на странице специальностей)
  const dynamicallyCollectedSpecialties = useMemo(() => {
    if (!isSpecialties) return [];

    const specialtiesMap = new Map();

    vuzData.forEach(vuz => {
      vuz.faculties?.forEach(faculty => {
        const dirs = [
          ...(faculty.bachelor?.directionsList || []),
          ...(faculty.master?.directionsList || [])
        ];

        dirs.forEach(dir => {
          if (!specialtiesMap.has(dir.name)) {
            specialtiesMap.set(dir.name, {
              id: dir.id,
              name: dir.name,
              sphereId: dir.sphereIds ? dir.sphereIds[0] : null,
              vuzCount: 1,
              vuzIds: new Set([vuz.id]),
              description: dir.description
            });
          } else {
            const existing = specialtiesMap.get(dir.name);
            existing.vuzIds.add(vuz.id);
            existing.vuzCount = existing.vuzIds.size;
          }
        });
      });
    });

    return Array.from(specialtiesMap.values()).map(item => {
      const { vuzIds, ...rest } = item;
      return rest;
    });
  }, [isSpecialties]);

  // 2. ВЫБИРАЕМ ДАННЫЕ ДЛЯ ОТОБРАЖЕНИЯ
  const currentData = isSpecialties ? dynamicallyCollectedSpecialties : professionsData;

  // 3. СЧИТАЕМ КОЛИЧЕСТВО ДЛЯ СФЕР
  const spheresWithCounts = useMemo(() => {
    return spheresData.map(sphere => {
      const count = currentData.filter(item => item.sphereId === sphere.id).length;
      return { ...sphere, count };
    }).filter(sphere =>
      sphere.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, currentData]);

  return (
      <div className="container" style={{ padding: '64px 20px' }}>
        <div className='title-and-catalog'>
          <h1 className="text-32b">{title}</h1>

          <div className="catalog-controls">
            <div className="field" style={{ flexGrow: 1 }}>
              <input
                type="text"
                className="field__input"
                placeholder=" "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <label className="field__label">
                Поиск {isSpecialties ? 'специальности' : 'профессии'}...
              </label>
              <img src="/search.svg" alt="Поиск" className="field__icon" />
            </div>

            <button className="btn btn--green btn--with-icon catalog-filter-btn">
              <img src="/list.svg" alt="Фильтр" width="20" height="20" />
              ЕГЭ
            </button>
          </div>

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

          {/* Блок популярных (теперь передаем currentData) */}
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