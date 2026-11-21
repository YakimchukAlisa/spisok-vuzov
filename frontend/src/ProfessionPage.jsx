import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProfessionById, getNapravleniyaByProfession } from './api/api.js';
import ProfessionCard from './component/ProfessionCard';
import CareerTestBlock from './component/CareerTestBlock';

export default function ProfessionPage() {
  const { id } = useParams();
  const [profession, setProfession] = useState(null);
  const [napravleniya, setNapravleniya] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getProfessionById(id)
      .then(res => {
        if (!isMounted) return;
        setProfession(res);
        setIsLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error('Ошибка загрузки профессии:', err);
        setError(err.response?.status === 404 ? 'notfound' : 'error');
        setIsLoading(false);
      });

    // Направления грузим параллельно; если эндпоинта нет — просто останется []
    getNapravleniyaByProfession(id)
      .then(res => { if (isMounted) setNapravleniya(res || []); })
      .catch(() => { /* эндпоинт опционален */ });

    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return <div className="container" style={{ padding: '100px' }}>Загрузка...</div>;
  }
  if (error === 'notfound') {
    return <div className="container" style={{ padding: '100px' }}>Профессия не найдена</div>;
  }
  if (error) {
    return <div className="container" style={{ padding: '100px' }}>Ошибка загрузки. Попробуйте позже.</div>;
  }
  if (!profession) {
    return <div className="container" style={{ padding: '100px' }}>Профессия не найдена</div>;
  }

  return (
    <div className="wrapper">
      <div className="container" style={{ marginTop: '100px' }}>

        {/* ШАПКА ПРОФЕССИИ */}
        <div className="global-specialty-header">
          <h1 className="text-32b" style={{ marginBottom: '16px' }}>{profession.name}</h1>
          <p className="text-20r">{profession.description}</p>
        </div>

        {/* ЧТО ДОЛЖЕН УМЕТЬ */}
        {profession.skills && profession.skills.length > 0 && (
          <div className="profession-skills">
            <h2 className="text-32b" style={{ marginBottom: '32px' }}>
              Что должен уметь {profession.name.toLowerCase()}?
            </h2>

            <div className="direction-skills__grid">
              {profession.skills.map((skill, index) => (
                <div
                  key={`${skill}-${index}`}
                  className="direction-skill-card"
                  style={{ alignItems: 'flex-start' }}
                >
                  <span className="direction-skill-card__number">{index + 1}</span>
                  <span className="text-20r">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* БЛОК ЗАРПЛАТЫ */}
        {profession.salaryLevels && profession.salaryLevels.length > 0 && (
          <div className="profession-salary" style={{ marginTop: '48px' }}>
            <h2 className="text-32b" style={{ marginBottom: '24px' }}>
              Зарплата
            </h2>

            <p className="text-20r" style={{ marginBottom: '40px' }}>
              Зарплата специалиста в сфере «{profession.name}» в России может зависеть от ряда факторов, включая уровень образования, опыт, регион работы, а также конкретное место работы.
            </p>

            <div className="salary-layout">
              {/* Картинка-иллюстрация (SVG) */}
              <div className="salary-image-wrapper">
                <img
                  src="/salary-illustration.svg"
                  alt="Зарплата"
                  className="salary-image"
                />
              </div>

              {/* Лестница зарплат */}
              <div className="salary-stairs">
                {profession.salaryLevels.map((item, index) => (
                  <div key={index} className="salary-card">
                    <div className="salary-card__text">
                      <span className="text-20b">{item.level}</span>
                      <span className="text-20b" style={{ color: 'var(--green)' }}>{item.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* КОМУ ПОДОЙДЁТ ПРОФЕССИЯ */}
        {profession.suitableFor && profession.suitableFor.length > 0 && (
          <div className="profession-suitable">
            <h2 className="text-32b" style={{ marginBottom: '24px' }}>
              Кому подойдёт профессия {profession.name.toLowerCase()}?
            </h2>

            {profession.suitableForText && (
              <p className="text-20r" style={{ marginBottom: '32px' }}>
                {profession.suitableForText}
              </p>
            )}

            <div className="direction-skills__grid">
              {profession.suitableFor.map((quality, index) => (
                <div
                  key={`${quality}-${index}`}
                  className="direction-skill-card"
                  style={{ alignItems: 'flex-start' }}
                >
                  <span className="direction-skill-card__number">{index + 1}</span>
                  <span className="text-20r">{quality}</span>
                </div>
              ))}
            </div>
          </div>
        )}

              {/* ПОДХОДЯЩИЕ СПЕЦИАЛЬНОСТИ */}
              {napravleniya.length > 0 && (
                <div className="profession-specialties" style={{ marginTop: '64px' }}>
                  <h2 className="text-32b" style={{ marginBottom: '24px' }}>
                    Подходящие специальности
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {napravleniya.map(n => (
                        <ProfessionCard
                            key={n.id}
                            data={n}
                            type="specialty"
                            isGlobal={true}
                        />
                    ))}
                  </div>
                </div>
              )}
        <CareerTestBlock />
      </div>
    </div>
  );
}