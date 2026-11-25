import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import DirectionCard from './component/DirectionCard';
import VuzDetailsHero from './component/VuzDetailsHero';
import { getVuzById, getNapravleniya, getFakultety, getVozmozhnosti } from './api/api';

// Порядок вкладок — как в реальности: от бакалавриата к аспирантуре
const LEVEL_ORDER = ['Бакалавриат', 'Специалитет', 'Магистратура', 'Аспирантура'];

export default function FacultyPage() {
  const { vuzId, facultyId } = useParams();

  const [vuz, setVuz] = useState(null);
  const [allDirections, setAllDirections] = useState([]);
  const [fakultety, setFakultety] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState(null);

  useEffect(() => {
    setLoading(true);
    setActiveLevel(null); // сброс вкладки при переходе на другой факультет

    Promise.all([
      getVuzById(vuzId),
      getNapravleniya(vuzId),
      getFakultety(vuzId),
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
  }, [vuzId, facultyId]);

  // === ВСЕ ХУКИ ДО ЭТОГО МЕСТА. Дальше только обычные вычисления и return ===

  // Направления только этого факультета
  const facultyDirections = useMemo(
    () => allDirections.filter(dir => String(dir.fakultetId) === String(facultyId)),
    [allDirections, facultyId]
  );

  // Уровни, которые реально есть у направлений факультета — в фиксированном порядке
  const availableLevels = useMemo(() => {
    const set = new Set();
    facultyDirections.forEach(dir =>
      (dir.profiles || []).forEach(p => { if (p.uroven) set.add(p.uroven); })
    );
    return LEVEL_ORDER.filter(l => set.has(l))
      .concat([...set].filter(l => !LEVEL_ORDER.includes(l)));
  }, [facultyDirections]);

  // Автовыбор первой вкладки
  useEffect(() => {
    if (activeLevel === null && availableLevels.length > 0) {
      setActiveLevel(availableLevels[0]);
    }
  }, [availableLevels, activeLevel]);

  // Адаптируем вуз под VuzDetailsHero (null, пока вуз не загружен)
  const adaptedVuz = useMemo(() => {
    if (!vuz) return null;
    return {
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
  }, [vuz, features]);

  // === РАННИЕ RETURN — теперь безопасно ===

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

  return (
    <div className="wrapper">
      <VuzDetailsHero data={adaptedVuz} />

      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="containerDirections">

          {/* ВКЛАДКИ — динамические, только существующие уровни */}
          {availableLevels.length > 0 && (
            <div style={{ display: 'flex', gap: '40px', marginBottom: '24px' }}>
              {availableLevels.map(level => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
                    color: activeLevel === level ? 'var(--black)' : 'var(--gray)',
                    borderBottom: activeLevel === level ? '3px solid var(--green)' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          )}

          {/* Карточки */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {(() => {
              const cards = [];

              facultyDirections.forEach((dir) => {
                const profiles = dir.profiles || [];

                // Профили выбранного уровня
                const levelProfiles = profiles.filter(p => p.uroven === activeLevel);
                if (levelProfiles.length === 0) return;

                const formPriority = ['Очная', 'Очно-заочная', 'Заочная'];

                // Группируем профили: один профиль может прийти в нескольких формах
                const profileGroups = new Map();

                levelProfiles.forEach((p) => {
                  const key = p.name;
                  if (!profileGroups.has(key)) {
                    profileGroups.set(key, []);
                  }
                  profileGroups.get(key).push(p);
                });

                // Для каждого профиля выбираем запись по приоритету форм
                profileGroups.forEach((variants) => {
                  const sorted = [...variants].sort(
                    (a, b) => formPriority.indexOf(a.forma) - formPriority.indexOf(b.forma)
                  );
                  const selectedProfile = sorted[0];

                  cards.push(
                    <DirectionCard
                      key={selectedProfile.id ?? `${dir.kod}_${selectedProfile.name}`}
                      data={{
                        ...selectedProfile,
                        code: dir.kod,
                        code_name: dir.name,
                        description: dir.opisanie,
                        kod: dir.kod,
                        napravlenieName: dir.name,
                        exams: dir.exams || [],
                        educationForms: {
                          fullTime: {
                            name: selectedProfile.forma || 'Очная',
                            budget: {
                              places: selectedProfile.budgetPlaces || 0,
                              minScore: selectedProfile.budgetMinScore || 0,
                            },
                            paid: {
                              places: selectedProfile.paidPlaces || 0,
                              minScore: selectedProfile.paidMinScore || 0,
                              minPrice: selectedProfile.paidMinPrice || 0,
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

          {/* Если на факультете вообще нет ни одного уровня */}
          {availableLevels.length === 0 && (
            <p className="text-14r" style={{ color: 'var(--gray)' }}>
              На этом факультете пока нет программ обучения.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
