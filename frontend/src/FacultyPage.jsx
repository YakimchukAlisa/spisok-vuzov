import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DirectionCard from './component/DirectionCard';
import VuzDetailsHero from './component/VuzDetailsHero';
import { getVuzById, getNapravleniya, getFakultety } from './api/api';

export default function FacultyPage() {
  const { vuzId, facultyId } = useParams();
  const [activeTab, setActiveTab] = useState('bachelor');

  const [vuz, setVuz] = useState(null);
  const [allDirections, setAllDirections] = useState([]);
  const [fakultety, setFakultety] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getVuzById(vuzId),
      getNapravleniya(vuzId),
      getFakultety(vuzId)
    ])
      .then(([vuzData, napravleniyaData, fakultetyData]) => {
        setVuz(vuzData);
        setAllDirections(napravleniyaData || []);
        setFakultety(fakultetyData || []);
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
        <Link to="/" className="btn btn--green" style={{ marginTop: '20px' }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const currentFaculty = fakultety.find(f => String(f.id) === String(facultyId));

  const logoForCard = currentFaculty?.imageUrl || vuz.logoUrl;

  // Фильтрация направлений
  const displayedDirections = allDirections.filter(dir => {
    const isRightFaculty = String(dir.fakultetId) === String(facultyId);

    const isRightLevel = activeTab === 'bachelor'
      ? (dir.uroven === 'Бакалавриат' || dir.uroven === 'Специалитет')
      : dir.uroven === 'Магистратура';

    return isRightFaculty && isRightLevel;
  });

  return (
    <div className="wrapper">
      <VuzDetailsHero data={vuz} />

      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="containerDirections">
          {/* Вкладки */}
          <div style={{ display: 'flex', gap: '40px', marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('bachelor')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
                color: activeTab === 'bachelor' ? 'var(--black)' : 'var(--gray)',
                borderBottom: activeTab === 'bachelor' ? '3px solid var(--green)' : '3px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              Бакалавриат
            </button>

            <button
              onClick={() => setActiveTab('master')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
                color: activeTab === 'master' ? 'var(--black)' : 'var(--gray)',
                borderBottom: activeTab === 'master' ? '3px solid var(--green)' : '3px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              Магистратура
            </button>
          </div>

          {/* Список карточек */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {displayedDirections.length > 0 ? (
              displayedDirections.map((dir) => {
                const fullTimeProfiles = dir.profiles
                  ? dir.profiles.filter(p => p.forma === 'Очная')
                  : [];

                if (fullTimeProfiles.length === 0) return null;

                return fullTimeProfiles.map((profile) => (
                  <DirectionCard
                    key={profile.id}
                    data={{
                      ...profile,
                      kod: dir.kod,
                      napravlenieName: dir.name,
                      exams: dir.exams
                    }}
                    facultyLogo={logoForCard}
                  />
                ));
              })
            ) : (
              <p className="text-14r" style={{ color: 'var(--gray)' }}>
                Направления для этой вкладки пока не добавлены (или произошла ошибка при загрузке).
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}