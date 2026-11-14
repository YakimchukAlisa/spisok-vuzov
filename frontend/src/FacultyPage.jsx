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

  useEffect(() => {
    Promise.all([
      getVuzById(vuzId),
      getNapravleniya(vuzId),
      getFakultety(vuzId),
      // если getVozmozhnosti упадёт — не ломаем основной поток
      getVozmozhnosti(vuzId).catch(() => []),
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

  const currentFaculty = fakultety.find(f => String(f.id) === String(facultyId));
  const logoForCard = currentFaculty?.imageUrl || vuz.logoUrl;

  // Адаптируем vuz под VuzDetailsHero + features из отдельного запроса
  const adaptedVuz = {
    id: vuz.id,
    name: vuz.name,
    fullName: vuz.abbreviatura,
    address: vuz.adress || 'Адрес не указан',
    imageUrl: vuz.imageUrl || '/img/default.jpg',
    logoUrl: vuz.logoUrl,
    totalPrograms: vuz.totalPrograms || 0,
    budget: { places: vuz.budgetPlaces || 0, minScore: vuz.budgetMinScore || 0 },
    paid: {
      places: vuz.paidPlaces || 0,
      minScore: vuz.paidMinScore || 0,
      minPrice: vuz.paidMinPrice || 0,
    },
    features,
    contacts: { phone: vuz.phone, email: vuz.email },
    socials: {
      website: vuz.site,
      vk: vuz.vkUrl,
      telegram: vuz.telegramUrl,
      max: vuz.maxUrl,
    },
  };

  // 1. Направления — только этого факультета (уровень у направления не фильтруем)
  const facultyDirections = allDirections.filter(
    dir => String(dir.fakultetId) === String(facultyId)
  );

  // 2. Уровень, который хотим показать
  const targetLevel =
    activeTab === 'bachelor' ? 'Бакалавриат'
    : activeTab === 'master' ? 'Магистратура'
    : 'Специалитет';

  return (
    <div className="wrapper">
      <VuzDetailsHero data={adaptedVuz} />

      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="containerDirections">
          {/* Вкладки */}
          <div style={{ display: 'flex', gap: '40px', marginBottom: '24px' }}>
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
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Карточки */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {(() => {
              const cards = [];

            facultyDirections.forEach((dir) => {
              const profiles = dir.profiles || [];
              const levelProfiles = profiles.filter(p => p.uroven === targetLevel);
              const fullTimeProfiles = levelProfiles.filter(p => p.forma === 'Очная');

              if (fullTimeProfiles.length === 0) return;

              fullTimeProfiles.forEach((profile) => {
                cards.push(
                  <DirectionCard
                    key={profile.id}
                    data={{
                      ...profile,
                      // код и название направления
                      code: dir.kod,
                      code_name: dir.name,
                      description: dir.opisanie,
                      kod: dir.kod,
                      napravlenieName: dir.name,
                      // экзамены направления
                      exams: dir.exams || [],
                      // статистика в формате, который ждёт DirectionCard
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
                return (
                  <p className="text-14r" style={{ color: 'var(--gray)' }}>
                    Направления для этой вкладки пока не добавлены.
                  </p>
                );
              }
              return cards;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}