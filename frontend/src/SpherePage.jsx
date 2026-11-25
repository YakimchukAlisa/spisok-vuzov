import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProfessionCard from './component/ProfessionCard';
import FilterButton from './component/FilterButton';
import CareerTestBlock from './component/CareerTestBlock';
import filterData from './DATA/filters.json';
import { getSphereById, getNapravleniyaBySphere, getProfessionsBySphere } from './api/api.js';
import './css/spherePage.css';

const TABS = [
  { key: 'bachelor', label: 'Бакалавриат' },
  { key: 'master', label: 'Магистратура' },
  { key: 'specialist', label: 'Специалитет' },
];

export default function SpherePage() {
  const { sphereId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'profession';
  const isSpecialties = type === 'specialty';

  const [sphere, setSphere] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExams, setSelectedExams] = useState([]);
  const [activeTab, setActiveTab] = useState('bachelor');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (isSpecialties) {
          const [sphereData, specialtiesData] = await Promise.all([
            getSphereById(sphereId),
            getNapravleniyaBySphere(sphereId),
          ]);
          setSphere(sphereData);
          setItems(Array.isArray(specialtiesData) ? specialtiesData : []);
        } else {
          const [sphereData, professionsData] = await Promise.all([
            getSphereById(sphereId),
            getProfessionsBySphere(sphereId),
          ]);
          setSphere(sphereData);
          setItems(Array.isArray(professionsData) ? professionsData : []);
        }
      } catch (err) {
        console.error('Ошибка:', err);
        setError(err.response?.data?.message || err.message || 'Не удалось загрузить данные');
      } finally {
        setIsLoading(false);
      }
    };

    if (sphereId) fetchData();
  }, [sphereId, type, isSpecialties]);

  const targetLevel = activeTab === 'bachelor' ? 'Бакалавриат'
    : activeTab === 'master' ? 'Магистратура'
    : 'Специалитет';

  // Фильтрация: уровень + поиск + ЕГЭ
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 0. Уровень образования (только для специальностей)
      if (isSpecialties) {
        const levels = item.uroven || '';
        if (!levels.includes(targetLevel)) return false;
      }

      // 1. Поиск (по названию или коду)
      const searchStr = `${item.name} ${item.kod || ''}`.toLowerCase();
      if (!searchStr.includes(searchQuery.toLowerCase())) return false;

      // 2. ЕГЭ (если выбраны предметы)
      if (selectedExams.length > 0) {
        if (item.exams && item.exams.length > 0) {
          return selectedExams.some(exam => item.exams.includes(exam));
        }
        return false;
      }

      return true;
    });
  }, [items, searchQuery, selectedExams, activeTab, targetLevel, isSpecialties]);

  if (isLoading) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Загрузка...</div>;
  if (error)     return <div className="container" style={{ padding: 100, textAlign: 'center', color: 'red' }}>Ошибка: {error}</div>;
  if (!sphere)   return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Сфера не найдена</div>;

  return (
    <div className="wrapper">
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className='sphere-page-list'>

          <h1 className="text-32b" style={{ marginBottom: '16px' }}>
            {sphere.name}: {isSpecialties ? 'Специальности' : 'Профессии'}
          </h1>

          {sphere.opisanie && (
            <p className="text-20r sphere-page__description" style={{ marginBottom: '32px' }}>
              {sphere.opisanie}
            </p>
          )}

          {/* ВКЛАДКИ ПО УРОВНЮ — только для специальностей */}
          {isSpecialties && (
            <div style={{ display: 'flex', gap: '40px', marginBottom: '24px' }}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
                    color: activeTab === tab.key ? 'var(--black)' : 'var(--gray)',
                    borderBottom: activeTab === tab.key ? '3px solid var(--green)' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* БЛОК ПОИСКА И ФИЛЬТРА */}
          <div className="catalog-controls" style={{ marginBottom: '32px' }}>
            <div className="field" style={{ flexGrow: 1 }}>
              <input
                type="text"
                className="field__input"
                placeholder=" "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <label className="field__label">
                Поиск {isSpecialties ? 'направления' : 'профессии'}...
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
          <div className="professions-block__list" style={{ marginBottom: '60px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <ProfessionCard
                  key={item.kod || item.id}
                  data={item}
                  type={type}
                  isGlobal={true}
                  sphere={sphere}
                />
              ))
            ) : (
              <p className="text-20r" style={{ color: 'var(--gray)' }}>
                {isSpecialties
                  ? `В этой сфере пока нет направлений уровня «${targetLevel}» по вашему запросу.`
                  : 'В этой сфере пока нет профессий по вашему запросу.'}
              </p>
            )}
          </div>
        </div>

        <CareerTestBlock />
      </div>
    </div>
  );
}
