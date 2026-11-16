import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DirectionCard from './component/DirectionCard';
import VuzDetailsHero from './component/VuzDetailsHero';
import { getVuzById, getNapravleniya, getFakultety, getVozmozhnosti } from './api/api';

export default function FacultyPage() {
  const { vuzId, facultyId } = useParams();
  const [activeTab, setActiveTab] = useState('bachelor');

  const [vuz, setVuz] = useState(null);
  const [allDirections, setAllDirections] = useState([]);
  const [fakultety, setFakultety] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ЗАГРУЗКА ДАННЫХ С БЕКЕНДА
  useEffect(() => {
    Promise.all([
      getVuzById(vuzId),
      getNapravleniya(vuzId),
      getFakultety(vuzId),
      getVozmozhnosti(vuzId).catch(() => []), // Если нет возможностей — не ломаем
    ])
      .then(([vuzData, napravleniyaData, fakultetyData, featuresData]) => {
        setVuz(vuzData);
        setAllDirections(Array.isArray(napravleniyaData) ? napravleniyaData : []);
        setFakultety(Array.isArray(fakultetyData) ? fakultetyData : []);
        setFeatures(Array.isArray(featuresData) ? featuresData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки:", err);
        setLoading(false);
      });
  }, [vuzId]);

  if (loading) {
    return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Загрузка...</div>;
  }
  
  if (!vuz) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-32b">Вуз не найден 😢</h1>
        <Link to="/" className="btn btn--green" style={{ marginTop: '20px' }}>Вернуться на главную</Link>
      </div>
    );
  }

  // Находим текущий факультет
  const currentFaculty = fakultety.find(f => String(f.id) === String(facultyId));
  if (!currentFaculty) {
    return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Факультет не найден</div>;
  }

  // Адаптируем вуз для шапки
  const adaptedVuz = {
    id: vuz.id,
    name: vuz.name,
    fullName: vuz.abbreviatura,
    address: vuz.adress || 'Адрес не указан',
    imageUrl: vuz.imageUrl || '/img/default.jpg',
    logoUrl: vuz.logoUrl,
    totalPrograms: vuz.totalPrograms || 0,
    budget: { places: vuz.budgetPlaces || 0, minScore: vuz.budgetMinScore || 0 },
    paid: { places: vuz.paidPlaces || 0, minScore: vuz.paidMinScore || 0, minPrice: vuz.paidMinPrice || 0 },
    features,
    contacts: { phone: vuz.phone, email: vuz.email },
    socials: { website: vuz.site, vk: vuz.vkUrl, telegram: vuz.telegramUrl, max: vuz.maxUrl },
  };

  const logoForCard = currentFaculty?.imageUrl || vuz.logoUrl;

  // 2. ФИЛЬТРАЦИЯ НАПРАВЛЕНИЙ И ГРУППИРОВКА
  const facultyDirections = allDirections.filter(
    dir => String(dir.fakultetId) === String(facultyId)
  );

  const targetLevel =
    activeTab === 'bachelor' ? 'Бакалавриат'
    : activeTab === 'master' ? 'Магистратура'
    : 'Специалитет';

  // Функция для рендера карточек
  const renderCards = () => {
    const cards = [];

    facultyDirections.forEach((dir) => {
      const profiles = dir.profiles || [];
      const levelProfiles = profiles.filter(p => p.uroven === targetLevel);

      if (levelProfiles.length === 0) return;

      // Группируем профили по названию (чтобы не было дублей очно/заочно)
      const groupedProfiles = {};
      levelProfiles.forEach(profile => {
        const key = profile.name;
        if (!groupedProfiles[key]) {
          groupedProfiles[key] = profile;
        } else if (profile.forma === 'Очная' && groupedProfiles[key].forma !== 'Очная') {
          groupedProfiles[key] = profile;
        }
      });

      Object.values(groupedProfiles).forEach((profile) => {
        cards.push(
          <DirectionCard
            key={profile.id}
            data={{
              ...profile,
              code: dir.kod,
              code_name: dir.name,
              description: dir.opisanie,
              kod: dir.kod,
              napravlenieName: dir.name,
              exams: dir.exams || [],
              educationForms: {
                fullTime: {
                  name: profile.forma || 'Очная',
                  budget: {
                    places: profile.budgetPlaces || 0,
                    minScore: profile.budgetMinScore || 0,
                  },
                  paid: {
                    places: profile.paidPlaces || 0,
                    minScore: profile.paidMinScore || 0,
                    minPrice: profile.paidMinPrice || 0,
                  },
                },
              },
            }}
            facultyLogo={logoForCard}
          />
        );
      });
    });

    if (cards.length === 0) {
      return <p className="text-14r" style={{ color: 'var(--gray)' }}>Направления для этой вкладки пока не добавлены.</p>;
    }
    return cards;
  };

  return (
    <div className="wrapper">
      <VuzDetailsHero data={adaptedVuz} />
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="containerDirections">
          
          {/* Вкладки */}
          <div style={{ display: 'flex', gap: '40px' }}>
            {[
              { key: 'bachelor', label: 'Бакалавриат' },
              { key: 'master', label: 'Магистратура' },
              { key: 'specialist', label: 'Специалитет' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
                  color: activeTab === tab.key ? 'var(--black)' : 'var(--gray)',
                  borderBottom: activeTab === tab.key ? '3px solid var(--green)' : '3px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Список карточек */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
            {renderCards()}
          </div>
        </div>
      </div>
    </div>
  );
}
