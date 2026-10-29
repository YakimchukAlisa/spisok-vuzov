import React from 'react';
import ProfessionCard from './ProfessionCard';
import professionsData from './../DATA/professions.json';
import './../css/professionsBlock.css';

export default function ProfessionsBlock({ sphereIds }) {
  // Если сфер нет, ничего не рендерим
  if (!sphereIds || sphereIds.length === 0) return null;

  // Находим все профессии, которые относятся к указанным сферам
  const matchedProfessions = professionsData.filter(prof => 
    sphereIds.includes(prof.sphereId)
  );

  // Если по этим сферам профессий нет — тоже ничего не выводим
  if (matchedProfessions.length === 0) return null;

  return (
    <div className="professions-block">
      <h2 className="text-32b professions-block__title">Подходящие профессии</h2>
      
      <div className="professions-block__subtitle-container">
        <p className="text-20r professions-block__subtitle">
          Всего: {matchedProfessions.length} профессий
        </p>
      </div>

      <div className="professions-block__list">
        {matchedProfessions.map((prof) => (
          <ProfessionCard key={prof.id} data={prof} />
        ))}
      </div>
    </div>
  );
}