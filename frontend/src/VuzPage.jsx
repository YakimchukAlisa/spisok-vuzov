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
    // Запрашиваем вуз, возможности и факультеты параллельно
    Promise.all([
      getVuzById(id),
      getVozmozhnosti(id),
      getFakultety(id)
    ])
      .then(([vuzData, featuresData, fakultetyData]) => {
        setVuz(vuzData);
        setFeatures(featuresData || []);
        setFakultety(fakultetyData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки данных:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Загрузка...</div>;
  }

  if (!vuz) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-32b">Вуз не найден</h1>
        <Link to="/" className="btn btn--green" style={{ marginTop: '20px' }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <VuzDetailsHero data={vuz} features={features} />

      <div className="container" style={{ padding: '40px 20px', marginBottom: '60px' }}>
        <h2 className="text-32b" style={{ marginBottom: '24px' }}>Факультеты</h2>

        <div className="fakultety-list">
          {fakultety.length > 0 ? (
            fakultety.map((fakultet) => (
              <FacultyCard key={fakultet.id} data={fakultet} />
            ))
          ) : (
            <p className="text-14r">У этого вуза пока нет добавленных факультетов.</p>
          )}
        </div>
      </div>
    </div>
  );
}