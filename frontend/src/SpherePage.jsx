import React, { useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import spheresData from './DATA/spheres.json';
import professionsData from './DATA/professions.json';
import vuzData from './DATA/cardVuz.json'; // Нужен для сбора специальностей
import ProfessionCard from './component/ProfessionCard';
import CareerTestBlock from './component/CareerTestBlock';
import './css/spherePage.css'; // Создадим чуть ниже

export default function SpherePage() {
  const { sphereId } = useParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Определяем контекст (Профессии или Специальности) из URL (query-параметр ?type=)
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'profession';
  const isSpecialties = type === 'specialty';

  // Находим текущую сферу
  const currentSphere = spheresData.find(s => s.id === Number(sphereId));

  // 1. Собираем специальности из вузов (если мы на вкладке специальностей)
  const dynamicallyCollectedSpecialties = useMemo(() => {
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
  }, []);

  // 2. Выбираем базовые данные
  const baseData = isSpecialties ? dynamicallyCollectedSpecialties : professionsData;

  // 3. Фильтруем по текущей сфере и поиску
  const filteredItems = useMemo(() => {
    return baseData.filter(item => {
      const matchSphere = item.sphereId === Number(sphereId);
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSphere && matchSearch;
    });
  }, [baseData, sphereId, searchQuery]);

  if (!currentSphere) {
    return <div className="container">Сфера не найдена</div>;
  }

  return (
    <div className="wrapper">
      <div className="container">
        <div className='sphere-page-list'>
        <h1 className="text-32b" style={{ marginBottom: '32px' }}>
          {currentSphere.name}: {isSpecialties ? 'Специальности' : 'Профессии'}
        </h1>

        {/* БЛОК ПОИСКА И ФИЛЬТРА */}
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

        {/* СПИСОК КАРТОЧЕК */}
        <div className="professions-block__list" style={{ marginBottom: '60px' }}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
               <ProfessionCard key={item.id} data={item} type={type} isGlobal={true} />
            ))
          ) : (
            <p className="text-20r" style={{ color: 'var(--gray)' }}>
              В этой сфере пока нет {isSpecialties ? 'специальностей' : 'профессий'} по вашему запросу.
            </p>
          )}
        </div>
        </div>

        {/* БЛОК С ТЕСТОМ НА ПРОФОРИЕНТАЦИЮ */}
        <CareerTestBlock />

      </div>
    </div>
  );
}