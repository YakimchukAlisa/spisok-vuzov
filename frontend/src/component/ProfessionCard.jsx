import React from 'react';
import { Link } from 'react-router-dom';
import spheresData from './../DATA/spheres.json'; // Импортируем справочник сфер
import './../css/professionCard.css';

export default function ProfessionCard({ data }) {
  if (!data) return null;

  // Находим сферу по ID, чтобы вывести её название (если нужно)
  const sphere = spheresData.find(s => s.id === data.sphereId);

  return (
    <div className="profession-card">
      
      {/* Шапка карточки: Название и статистика */}
      <div className="profession-card__top">
        <div className="profession-card__title-row">
          <h3 className="profession-card__title">{data.name}</h3>
          {/* Бейджик со сферой (например, "Информационные технологии") */}
          {sphere && (
            <span className="profession-card__sphere">{sphere.name}</span>
          )}
        </div>
        
        <div className="profession-card__stats">
          <Link to="#" className="profession-card__stat-link">
            {data.vuzCount} Вуза
          </Link>
          {data.specialtyCount && (
            <Link to="#" className="profession-card__stat-link">
              {data.specialtyCount} специальностей
            </Link>
          )}
        </div>
      </div>

      {/* Описание профессии */}
      <p className="profession-card__description">{data.description}</p>

      {/* Кнопка "Подобрать" */}
      <Link to={`/profession/${data.id}`} className="btn btn--green profession-card__btn">
        Подробнее
      </Link>
    </div>
  );
}