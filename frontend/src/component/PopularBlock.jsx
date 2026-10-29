import React, { useState } from 'react';
import ProfessionCard from './ProfessionCard'; // Используем карточку, которую делали ранее
import './../css/popularBlock.css';

export default function PopularBlock({ items, title, type }) {
  // Состояние: сколько элементов показывать (изначально 4)
  const [visibleCount, setVisibleCount] = useState(4);

  if (!items || items.length === 0) return null;

  // Сортируем по "популярности" (например, по количеству вузов) и берем нужное количество
  const sortedItems = [...items].sort((a, b) => b.vuzCount - a.vuzCount);
  const visibleItems = sortedItems.slice(0, visibleCount);
  
  // Проверяем, есть ли еще элементы, которые можно показать
  const hasMore = visibleCount < sortedItems.length;

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 4); // Добавляем еще 4 карточки
  };

  return (
    <div className="popular-block">
      <h2 className="text-32b popular-block__title">{title}</h2>
      
      <div className="professions-block__list">
        {visibleItems.map((item) => (
          <ProfessionCard key={item.id} data={item} />
        ))}
      </div>

      {/* Кнопка "Загрузить еще" */}
      {hasMore && (
        <div className="popular-block__more-wrapper">
          <button 
            onClick={handleShowMore} 
            className="btn btn--green-outline popular-block__btn-more"
          >
            Загрузить ещё
          </button>
        </div>
      )}
    </div>
  );
}