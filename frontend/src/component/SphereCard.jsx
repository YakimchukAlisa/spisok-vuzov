import React from 'react';
import { Link } from 'react-router-dom';
import './../css/sphereCard.css';

export default function SphereCard({ sphere, count, type }) {
  // type — это 'profession' или 'specialty' (чтобы понять, куда вести ссылку)
  
  return (
    <Link to={`/sphere/${sphere.id}?type=${type}`} className="sphere-card">
      
      <div className="sphere-card__info">
        <h3 className="sphere-card__title">{sphere.name}</h3>
        <p className="sphere-card__count">
          {count} {type === 'profession' ? 'профессий' : 'специальностей'}
        </p>
      </div>

      {sphere.imageUrl && (
        <img src={sphere.imageUrl} alt={sphere.name} className="sphere-card__image" />
      )}
      
    </Link>
  );
}