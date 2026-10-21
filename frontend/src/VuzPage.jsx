import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VuzDetailsHero from './component/VuzDetailsHero';
import { getVuzById, getVozmozhnosti } from './api/api'; // импортируем обе функции

export default function VuzPage() {
  const { id } = useParams();
  const [vuz, setVuz] = useState(null);
  const [features, setFeatures] = useState([]); // Стейт для возможностей
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Запрашиваем вуз и возможности параллельно
    Promise.all([
      getVuzById(id),
      getVozmozhnosti(id)
    ])
      .then(([vuzData, featuresData]) => {
        setVuz(vuzData);
        setFeatures(featuresData || []);
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
        <h1 className="text-32b">Вуз не найден</h1>
        <Link to="/" className="btn btn--green" style={{ marginTop: '20px' }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="wrapper">
      {/* Передаем и данные вуза, и массив возможностей */}
      <VuzDetailsHero data={vuz} features={features} />

      <div className="container" style={{ padding: '40px 20px' }}>
        <h2 className="text-32b">Факультеты (в разработке)</h2>
      </div>
    </div>
  );
}