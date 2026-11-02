import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useFavorites } from './FavoritesContext.jsx'; // <--- ИМПОРТ КОНТЕКСТА
import '../css/vuzCard.css'; // Убедитесь, что путь к стилям верный

export default function VuzCard({ data, showCheckbox = false }) {
  // Достаем данные из глобального контекста
  const { isAuth, favorites, toggleFavorite } = useFavorites();
  
  const [isChecked, setIsChecked] = useState(false);

  const { name, fullName, imageUrl, budget, paid } = data;

  // Проверяем, находится ли этот вуз в избранном
  const isFavorite = favorites.vuzes.some(v => v.id === data.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };
console.log("Авторизован?", isAuth);
  return (
    <div className="vuz-card">

      <div className="vuz-card__image-wrapper">
        <img src={imageUrl} alt={name} className="vuz-card__image" />

        {showCheckbox && (
          <label className="vuz-card__checkbox-label">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <span className="vuz-card__checkbox-custom"></span>
          </label>
        )}

        {/* 👇 КНОПКА ИЗБРАННОГО 👇 */}
        {/* Показываем её ТОЛЬКО если пользователь авторизован */}
        {isAuth && (
          <button
            className={`vuz-card__favorite ${isFavorite ? 'is-active' : ''}`}
            onClick={(e) => {
              e.preventDefault(); // Останавливаем переход, если кнопка внутри ссылки
              toggleFavorite('vuzes', data); // Передаем тип 'vuzes' и данные
            }}
            title={isFavorite ? "Убрать из избранного" : "В избранное"}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill={isFavorite ? "var(--white)" : "none"} 
              stroke={"var(--white)"} 
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        )}
      </div>

      <div className="vuz-card__content">
        <div className="vuz-card__title_and_subtitle">
          <h2 className="text-28sm vuz-card__title">{name}</h2>
          <p className="text-14r vuz-card__subtitle">{fullName}</p>
        </div>

        <div className="vuz-card__stats">
          <div className="vuz-card__stat-block">
            <span className="vuz-card__stat-label">Бюджет</span>
            <span className="vuz-card__stat-main">{budget.places} мест</span>
            <span className="vuz-card__stat-sub">от {budget.minScore} баллов</span>
          </div>

          <div className="vuz-card__stat-block">
            <span className="vuz-card__stat-label">Платно</span>
            <span className="vuz-card__stat-main">{paid.places} мест</span>
            <span className="vuz-card__stat-sub">от {paid.minScore} баллов</span>
            <span className="vuz-card__stat-sub">от {formatPrice(paid.minPrice)}</span>
          </div>
        </div>

        <Link to={`/vuz/${data.id}`} className="btn btn--green vuz-card__more-btn">
          Подробнее
        </Link>
      </div>
    </div>
  );
}