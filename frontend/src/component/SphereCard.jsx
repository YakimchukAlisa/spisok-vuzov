import React from 'react';
import { Link } from 'react-router-dom';
import './../css/sphereCard.css';

export default function SphereCard({ sphere, type }) {
  // Выбираем правильное число в зависимости от вкладки
  const displayCount = type === 'profession'
    ? (sphere.profCount ?? 0)
    : (sphere.count ?? 0);

  return (
   <Link to={`/sphere/${sphere.id}?type=${type}`} className="sphere-card">

      <div className="sphere-card__info">
        <h3 className="sphere-card__title">{sphere.name}</h3>
        <p className="sphere-card__count">
          {displayCount} {type === 'profession' ? 'профессий' : 'специальностей'}
        </p>
      </div>

     {(sphere.logoUrl || sphere.imageUrl) && (
       <img
         src={sphere.logoUrl || sphere.imageUrl}
         alt={sphere.name}
         className="sphere-card__image"
       />
     )}
      
    </Link>
  );
}