import React, { useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import spheresData from './DATA/spheres.json';
import professionsData from './DATA/professions.json';
import vuzData from './DATA/cardVuz.json';
import filterData from './DATA/filters.json';
import ProfessionCard from './component/ProfessionCard';
import FilterButton from './component/FilterButton';
import CareerTestBlock from './component/CareerTestBlock';
import './css/spherePage.css';

export default function SpherePage() {
  const { sphereId } = useParams();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExams, setSelectedExams] = useState([]);

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'profession';
  const isSpecialties = type === 'specialty';

  const currentSphere = spheresData.find(s => s.id === Number(sphereId));

  // 1. Собираем специальности (без изменений)
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

  // 2. Выбираем данные
  const baseData = isSpecialties ? dynamicallyCollectedSpecialties : professionsData;

  // 3. Фильтруем по сфере, поиску И ВЫБРАННЫМ ЭКЗАМЕНАМ
  const filteredItems = useMemo(() => {
    return baseData.filter(item => {
      const matchSphere = item.sphereId === Number(sphereId);
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

      // 👇 ЛОГИКА ФИЛЬТРА ПО ПРЕДМЕТАМ 👇
      // Если предметы не выбраны, показываем все. Если выбраны, ищем совпадения.
      let matchExams = true;
      if (selectedExams.length > 0 && item.exams) {
        matchExams = selectedExams.some(exam => item.exams.includes(exam));
      } else if (selectedExams.length > 0 && !item.exams) {
        // Если предметы выбраны, но у профессии их нет, не показываем
        matchExams = false;
      }

      return matchSphere && matchSearch && matchExams;
    });
  }, [baseData, sphereId, searchQuery, selectedExams]);

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
            {/* Поле поиска */}
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

            {isSpecialties && (
              <FilterButton
                text="ЕГЭ"
                iconSrc="/list.svg"
                options={{ "Все предметы": filterData.exams }}
                selectedValues={selectedExams}
                onChange={setSelectedExams}
              />
            )}
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

        <CareerTestBlock />
      </div>
    </div>
  );
}