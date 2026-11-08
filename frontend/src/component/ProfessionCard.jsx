import React from 'react';
import { Link } from 'react-router-dom';
import spheresData from './../DATA/spheres.json';
import professionsData from './../DATA/professions.json';
import vuzData from './../DATA/cardVuz.json';
import './../css/professionCard.css';

export default function ProfessionCard({ data, type = 'profession', isGlobal = false, sphere: sphereProp }) {
  if (!data) return null;

  // sphere: сначала пропс из SpherePage, иначе — поиск по JSON (для старых мест)
  const sphere = sphereProp || spheresData.find(s => s.id === data.sphereId);

  // sphereId может быть числом, массивом или отсутствовать (у абстрактного DTO его нет)
  const currentSphereId = Array.isArray(data.sphereId)
    ? data.sphereId[0]
    : (data.sphereId ?? (Array.isArray(data.sphereIds) ? data.sphereIds[0] : undefined));

  // 1. ЛОГИКА ДЛЯ ПРОФЕССИЙ (оставлена как была — на JSON)
  let realSpecialtyCount = 0;
  if (type === 'profession') {
    const uniqueSpecialties = new Set();
    vuzData.forEach(vuz => {
      vuz.faculties?.forEach(faculty => {
        const dirs = [
          ...(faculty.bachelor?.directionsList || []),
          ...(faculty.master?.directionsList || [])
        ];
        dirs.forEach(dir => {
          if (dir.sphereIds?.includes(currentSphereId)) {
            uniqueSpecialties.add(dir.name);
          }
        });
      });
    });
    realSpecialtyCount = uniqueSpecialties.size;
  }

  // 2. ЛОГИКА ДЛЯ СПЕЦИАЛЬНОСТЕЙ (оставлена как была — на JSON)
  const professionsInSphere = type === 'specialty'
    ? professionsData.filter(prof => prof.sphereId === currentSphereId).length
    : 0;

  // ==========================================
  // 3. ССЫЛКА
  // ==========================================
  let linkPath = `/profession/${data.id}`; // для профессий

  if (type === 'specialty') {
    if (isGlobal) {
      // В каталоге — ведём на абстрактное направление по коду
      linkPath = data.kod
        ? `/napravlenie/${encodeURIComponent(data.kod)}`
        : (data.id ? `/specialty/${data.id}` : '#');
    } else {
      // Внутри вуза — конкретная строка Napravlenie, есть vuzId/facultyId
      linkPath = data.vuzId
        ? `/vuz/${data.vuzId}/faculty/${data.facultyId}/direction/${data.id}`
        : (data.kod ? `/napravlenie/${encodeURIComponent(data.kod)}` : '#');
    }
  }

  // Описание: в AbstractNapravlenieDto поле называется opisanie
  const description = data.opisanie ?? data.description;

  return (
    <div className="profession-card">

      <div className="profession-card__top">
        <div className="profession-card__title-row">
          <h3 className="profession-card__title">
            {data.name}
            {data.kod && (
              <span className="profession-card__kod" style={{ marginLeft: 8, color: 'var(--gray)', fontWeight: 400 }}>
                {data.kod}
              </span>
            )}
          </h3>
          {sphere && (
            <span className="profession-card__sphere">{sphere.name}</span>
          )}
        </div>

        <div className="profession-card__stats">

          {/* 👇 ДЛЯ СПЕЦИАЛЬНОСТЕЙ (Карточка "Инноватика") */}
          {type === 'specialty' && (
            <>
              <span className="profession-card__stat-link">
                {data.vuzCount ?? 0} {data.vuzCount === 1 ? 'вуз' : 'вузов'}
              </span>

              {/* Выводим количество профессий, если оно пришло */}
              {data.professionCount > 0 && (
                <span className="profession-card__stat-link">
                  {data.professionCount} {data.professionCount === 1 ? 'профессия' : 'профессий'}
                </span>
              )}
            </>
          )}

          {/* 👇 ДЛЯ ПРОФЕССИЙ (Карточка "Архитектор") */}
          {type === 'profession' && (
            <>
              {/* Выводим количество специальностей, если оно пришло */}
              {data.specialtyCount > 0 && (
                <span className="profession-card__stat-link">
                  {data.specialtyCount} {data.specialtyCount === 1 ? 'специальность' : 'специальностей'}
                </span>
              )}
            </>
          )}
         </div>
        </div>

      {description && (
        <p className="profession-card__description">{description}</p>
      )}

      <Link to={linkPath} className="btn btn--green profession-card__btn">
        Подробнее
      </Link>
    </div>
  );
}