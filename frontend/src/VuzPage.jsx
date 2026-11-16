import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VuzDetailsHero from './component/VuzDetailsHero';
import FacultyCard from './component/FacultyCard';
import { getVuzById, getFakultety, getVozmozhnosti } from './api/api.js';

export default function VuzPage() {
  const { id } = useParams();
  const [vuz, setVuz] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVuzData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Три запроса — три переменные
        const [vuzInfo, facultiesInfo, features] = await Promise.all([
          getVuzById(id),
          getFakultety(id),
          getVozmozhnosti(id)
        ]);

        const adaptedVuz = {
          id: vuzInfo.id,
          name: vuzInfo.name,
          fullName: vuzInfo.abbreviatura,
          address: vuzInfo.adress || 'Адрес не указан',
          imageUrl: vuzInfo.imageUrl || '/img/default.jpg',
          logoUrl: vuzInfo.logoUrl,
          totalPrograms: vuzInfo.totalPrograms || 0,

          budget: {
            places: vuzInfo.budgetPlaces || 0,
            minScore: vuzInfo.budgetMinScore || 0
          },
          paid: {
            places: vuzInfo.paidPlaces || 0,
            minScore: vuzInfo.paidMinScore || 0,
            minPrice: vuzInfo.paidMinPrice || 0
          },

          features: features || [],
          contacts: {
            phone: vuzInfo.phone,
            email: vuzInfo.email
          },
          socials: {
            website: vuzInfo.site,
            vk: vuzInfo.vkUrl,
            telegram: vuzInfo.telegramUrl,
            max: vuzInfo.maxUrl
          }
        };

        setVuz(adaptedVuz);
        setFaculties(facultiesInfo);
      } catch (err) {
        console.error("Ошибка при загрузке данных вуза:", err);
        setError('Не удалось загрузить данные вуза. Проверьте, что бэкенд запущен.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchVuzData();
  }, [id]);

  if (isLoading) {
    return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-32b" style={{ color: 'red' }}>{error}</h1>
        <Link to="/" className="btn btn--green" style={{ marginTop: '20px' }}>Вернуться на главную</Link>
      </div>
    );
  }

  if (!vuz) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-32b">Вуз не найден</h1>
        <Link to="/" className="btn btn--green" style={{ marginTop: '20px' }}>Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <VuzDetailsHero data={vuz} />

      <div className="container" style={{ padding: '40px 20px', gap: '32px' }}>
        <h2 className="text-32b">Факультеты</h2>

        {faculties && faculties.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {faculties.map((faculty) => (
              <FacultyCard key={faculty.id} data={faculty} />
            ))}
          </div>
        ) : (
          <p className="text-14r" style={{ color: 'var(--gray)' }}>
            Информация о факультетах для этого вуза пока не добавлена.
          </p>
        )}
      </div>
    </div>
  );
}