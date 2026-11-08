import React from 'react';
import { Link } from 'react-router-dom';
import './../css/professionCard.css';

export default function ProfessionCard({ data, type = 'profession', isGlobal = false, sphere: sphereProp }) {
  if (!data) return null;

  // Берем названия сфер напрямую из данных (которые прислал бэкенд)
  let sphereNames = data.sphereNames || [];

  // Если бэкенд не прислал, но мы передали сферу пропсом (как на странице сферы)
  if (sphereNames.length === 0 && sphereProp) {
      sphereNames = [sphereProp.name];
  }

  // Ссылка
  let linkPath = `/profession/${data.id}`;
  if (type === 'specialty') {
    linkPath = data.kod ? `/napravlenie/${encodeURIComponent(data.kod)}` : `/specialty/${data.id}`;
  }

  const description = data.opisanie ?? data.description;

  return (
    <div className="profession-card">
      <div className="profession-card__top">

        <div className="profession-card__title-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h3 className="profession-card__title" style={{ margin: 0 }}>{data.name}</h3>

          {/* 👇 Выводим овалы по названиям, пришедшим с бэкенда */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {sphereNames.map((name, idx) => (
              <span key={idx} className="profession-card__sphere" style={{
                backgroundColor: '#e8f5e9',
                color: 'var(--green)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Статистика */}
        <div className="profession-card__stats">
          {type === 'specialty' && (
            <>
              <span className="profession-card__stat-link">
                {data.vuzCount ?? 0} {data.vuzCount === 1 ? 'вуз' : 'вузов'}
              </span>
              {data.professionCount > 0 && (
                <span className="profession-card__stat-link">
                  {data.professionCount} {data.professionCount === 1 ? 'профессия' : 'профессий'}
                </span>
              )}
            </>
          )}

          {type === 'profession' && (
            <>
              {data.specialtyCount > 0 && (
                <span className="profession-card__stat-link">
                  {data.specialtyCount} {data.specialtyCount === 1 ? 'специальность' : 'специальностей'}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {description && <p className="profession-card__description">{description}</p>}

      <Link to={linkPath} className="btn btn--green profession-card__btn">
        Подробнее
      </Link>
    </div>
  );
}