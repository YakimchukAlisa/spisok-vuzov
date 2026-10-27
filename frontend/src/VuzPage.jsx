import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VuzDetailsHero from './component/VuzDetailsHero';
import FacultyCard from './component/FacultyCard';
import { getVuzById, getVozmozhnosti, getFakultety } from './api/api';

export default function VuzPage() {
  const { id } = useParams();

  const [vuz, setVuz] = useState(null);
  const [features, setFeatures] = useState([]);
  const [fakultety, setFakultety] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Запрашиваем вуз с ID:', id); // <-- Лог для проверки

    Promise.all([
      getVuzById(id),
      getVozmozhnosti(id),
      getFakultety(id)
    ])
      .then(([vuzData, featuresData, fakultetyData]) => {
        console.log('Данные вуза из БД:', vuzData); // <-- Смотрим, что пришло
        setVuz(vuzData);
        setFeatures(featuresData || []);
        setFakultety(fakultetyData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки вуза:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Загрузка...</div>;
  }

  if (!vuz) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-32b">Вуз не найден 😢</h1>
        <Link to="/" className="btn btn--green" style={{ marginTop: '20px' }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <VuzDetailsHero data={vuz} features={features} />

      <div className="container" style={{ padding: '40px 20px' }}>
        <h2 className="text-32b">Факультеты</h2>

        {fakultety && fakultety.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
            {fakultety.map((faculty) => (
              <FacultyCard key={faculty.id} data={faculty} />
            ))}
          </div>
        ) : (
          <p className="text-14r" style={{ color: 'var(--gray)', marginTop: '24px' }}>
            Информация о факультетах для этого вуза пока не добавлена.
          </p>
        )}
      </div>
    </div>
  );
}