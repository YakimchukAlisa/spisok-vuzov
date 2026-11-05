import React from 'react';
import { Link } from 'react-router-dom';
import vuzData from './../DATA/cardVuz.json';
import './../css/similarDirections.css';

export default function SimilarDirections({ currentDirectionId, sphereIds }) {
  if (!sphereIds || sphereIds.length === 0) return null;

  let allDirections = [];

  // 1. Собираем ВСЕ направления
  vuzData.forEach(vuz => {
    vuz.faculties?.forEach(faculty => {
      const dirs = [
        ...(faculty.bachelor?.directionsList || []),
        ...(faculty.master?.directionsList || [])
      ];
      
      dirs.forEach(dir => {
        allDirections.push({ ...dir, vuzId: vuz.id, facultyId: faculty.id });
      });
    });
  });

  // 2. Фильтруем похожие
  let similar = allDirections.filter(dir => 
    dir.id !== currentDirectionId && 
    dir.sphereIds?.some(id => sphereIds.includes(id))
  );

  // 3. Группируем
  const groupedSimilar = similar.reduce((acc, dir) => {
    const key = dir.name; 
    if (!acc[key]) {
      acc[key] = { ...dir, vuzIds: new Set(), specialtyCount: 0 };
    }
    acc[key].vuzIds.add(dir.vuzId);
    acc[key].specialtyCount += 1;
    return acc;
  }, {});

  const finalSimilar = Object.values(groupedSimilar).map(group => ({
    ...group,
    vuzCount: group.vuzIds.size,
    firstVuzId: Array.from(group.vuzIds)[0] 
  }));

  // Считаем общее количество уникальных специальностей
  const totalCount = finalSimilar.length;

  // Берем первые 4 для вывода
  const limitedSimilar = finalSimilar.slice(0, 4);

  if (limitedSimilar.length === 0) return null;

  return (
    <div className="similar-directions">
      <h2 className="text-32b similar-directions__title">Похожие специальности</h2>
      
      {/* ВОТ ЭТА СТРОКА С КОЛИЧЕСТВОМ */}
      <p className="text-20r similar-directions__subtitle">
        Всего: {totalCount} специальностей
      </p>

      <div className="professions-block__list" style={{ marginTop: '24px' }}>
        {limitedSimilar.map((group, index) => (
          <div key={index} className="profession-card">
            
            <div className="profession-card__top">
              <div className="profession-card__title-row">
                <h3 className="profession-card__title">{group.name}</h3>
                <span className="profession-card__sphere">{group.code}</span>
              </div>
              
              <div className="profession-card__stats">
                <span className="profession-card__stat-link" style={{ cursor: 'default' }}>
                  {group.vuzCount} {group.vuzCount === 1 ? 'Вуз' : 'Вуза(ов)'}
                </span>
              </div>
            </div>

            <p className="profession-card__description">{group.description}</p>

            <Link 
              to={`/vuz/${group.firstVuzId}/faculty/${group.facultyId}/direction/${group.id}`} 
              className="btn btn--green profession-card__btn"
            >
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}