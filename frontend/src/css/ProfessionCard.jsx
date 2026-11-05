import React from 'react';
import { Link } from 'react-router-dom';
import spheresData from './../DATA/spheres.json';
import professionsData from './../DATA/professions.json';
import vuzData from './../DATA/cardVuz.json';
import './../css/professionCard.css';

// Добавили пропс isGlobal
export default function ProfessionCard({ data, type = 'profession', isGlobal = false }) {
  if (!data) return null;

  const sphere = spheresData.find(s => s.id === data.sphereId);
  const currentSphereId = Array.isArray(data.sphereId) ? data.sphereId[0] : data.sphereId;

  // 1. ЛОГИКА ДЛЯ ПРОФЕССИЙ
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

  // 2. ЛОГИКА ДЛЯ СПЕЦИАЛЬНОСТЕЙ
  const professionsInSphere = type === 'specialty' 
    ? professionsData.filter(prof => prof.sphereId === currentSphereId).length 
    : 0;

  // ==========================================
  // 3. ФОРМИРУЕМ ПРАВИЛЬНУЮ ССЫЛКУ
  // ==========================================
  let linkPath = `/profession/${data.id}`; // По умолчанию для профессий

  if (type === 'specialty') {
    if (isGlobal) {
      // Если мы в каталоге — ведем на глобальную страницу специальности
      linkPath = `/specialty/${data.id}`;
    } else {
      // Если мы внутри вуза — ведем на страницу этой специальности в конкретном вузе
      linkPath = data.vuzId 
        ? `/vuz/${data.vuzId}/faculty/${data.facultyId}/direction/${data.id}` 
        : '#';
    }
  }

  return (
    <div className="profession-card">
      
      <div className="profession-card__top">
        <div className="profession-card__title-row">
          <h3 className="profession-card__title">{data.name}</h3>
          {sphere && (
            <span className="profession-card__sphere">{sphere.name}</span>
          )}
        </div>
        
        <div className="profession-card__stats">
          
          {/* Для профессий */}
          {type === 'profession' && realSpecialtyCount > 0 && (
            <span className="profession-card__stat-link">
              {realSpecialtyCount} {realSpecialtyCount === 1 ? 'специальность' : 'специальностей'}
            </span>
          )}

          {/* Для специальностей */}
          {type === 'specialty' && (
            <>
              <span className="profession-card__stat-link">
                {data.vuzCount || 0} {data.vuzCount === 1 ? 'Вуз' : 'Вуза(ов)'}
              </span>
              
              {professionsInSphere > 0 && (
                <span className="profession-card__stat-link">
                  {professionsInSphere} {professionsInSphere === 1 ? 'профессия' : 'профессий'}
                </span>
              )}
            </>
          )}

        </div>
      </div>

      <p className="profession-card__description">{data.description}</p>

      <Link to={linkPath} className="btn btn--green profession-card__btn">
        Подробнее
      </Link>
    </div>
  );
}