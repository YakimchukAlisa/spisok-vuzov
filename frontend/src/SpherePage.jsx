import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import ProfessionCard from './component/ProfessionCard';
import { getSphereById, getNapravleniyaBySphere, getProfessionsBySphere } from './api/api.js';
import './css/spherePage.css';   // 👈 правильный путь к css

export default function SpherePage() {
  const { sphereId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'profession'; // 'profession' или 'specialty'

  const [sphere, setSphere] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bachelor');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 👇 В зависимости от type, делаем разные запросы
        if (type === 'profession') {
          const [sphereData, professionsData] = await Promise.all([
            getSphereById(sphereId),
            getProfessionsBySphere(sphereId), // запрос за профессиями
          ]);
          setSphere(sphereData);
          setItems(Array.isArray(professionsData) ? professionsData : []);
        } else {
          const [sphereData, specialtiesData] = await Promise.all([
            getSphereById(sphereId),
            getNapravleniyaBySphere(sphereId), // запрос за специальностями
          ]);
          setSphere(sphereData);
          setItems(Array.isArray(specialtiesData) ? specialtiesData : []);
        }
      } catch (err) {
        console.error('Ошибка:', err);
        setError(err.response?.data?.message || err.message || 'Не удалось загрузить данные');
      } finally {
        setIsLoading(false);
      }
    };

    if (sphereId) fetchData();
  }, [sphereId, type]);

  // Фильтр по уровню (только для специальностей)
  const filteredItems = type === 'specialty'
    ? items.filter(item => {
        const target = activeTab === 'bachelor' ? 'Бакалавриат' : 'Магистратура';
        return (item.uroven || '').toLowerCase().includes(target.toLowerCase());
      })
    : items;

  if (isLoading) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Загрузка...</div>;
  if (error)     return <div className="container" style={{ padding: 100, textAlign: 'center', color: 'red' }}>Ошибка: {error}</div>;
  if (!sphere)   return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Сфера не найдена (id={sphereId})</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="text-32b">
        {sphere.name}: {type === 'specialty' ? 'Специальности' : 'Профессии'}
      </h1>

      {sphere.opisanie && (
        <p className="text-16r" style={{ color: 'var(--gray)', marginTop: 8 }}>{sphere.opisanie}</p>
      )}

      {/* Вкладки показываем только для специальностей */}
      {type === 'specialty' && (
        <div style={{ display: 'flex', gap: '40px', margin: '24px 0' }}>
          <button
            onClick={() => setActiveTab('bachelor')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
              color: activeTab === 'bachelor' ? 'var(--black)' : 'var(--gray)',
              borderBottom: activeTab === 'bachelor' ? '3px solid var(--green)' : '3px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >Бакалавриат</button>
          <button
            onClick={() => setActiveTab('master')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
              color: activeTab === 'master' ? 'var(--black)' : 'var(--gray)',
              borderBottom: activeTab === 'master' ? '3px solid var(--green)' : '3px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >Магистратура</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ProfessionCard
              key={item.id} // для профессий и специальностей ID уникален
              data={item}
              type={type}
              isGlobal={true}
              sphere={sphere}
            />
          ))
        ) : (
          <p className="text-14r" style={{ color: 'var(--gray)' }}>
            {type === 'specialty'
              ? `Направлений (${activeTab === 'bachelor' ? 'бакалавриат' : 'магистратура'}) пока нет`
              : 'Профессий пока нет'}
          </p>
        )}
      </div>

      <Link to={type === 'specialty' ? '/specialties' : '/professions'}
            className="btn btn--green" style={{ marginTop: 24 }}>
        Назад к каталогу
      </Link>
    </div>
  );
}