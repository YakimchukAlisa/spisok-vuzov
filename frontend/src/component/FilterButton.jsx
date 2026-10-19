import React, { useState, useRef, useEffect } from 'react';
import FilterPopover from './FilterPopover'; 

export default function FilterButton({ text, iconSrc, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const wrapperRef = useRef(null);

  // Закрытие по клику вне окна
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = (selectedItems) => {
    setSavedFilters(selectedItems);
    setIsOpen(false);
  };

  const handleReset = (e) => {
    e.stopPropagation(); // Останавливаем всплытие, чтобы не открывался попап
    setSavedFilters([]); // Очищаем фильтры
    setIsOpen(false);    // На всякий случай закрываем попап, если он был открыт
  };

  return (
    <div className="filter-wrapper" ref={wrapperRef}>
      
      <button 
        className={`btn btn--with-icon ${savedFilters.length > 0 ? 'btn--gray-dark' : 'btn--gray-light'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {iconSrc && <img src={iconSrc} alt={text} className="btn__icon-left" />}
        <span>{text} {savedFilters.length > 0 ? `(${savedFilters.length})` : ''}</span>
        
        {/* Место под крестик */}
        <div className="btn__icon-right">
          {savedFilters.length > 0 && (
             <img 
               src="/close.svg" 
               alt="Сбросить фильтр" 
               onClick={handleReset} 
               style={{ cursor: 'pointer' }} // Добавляем курсор-ручку для удобства
             />
          )}
        </div>
      </button>

      {isOpen && (
        <FilterPopover 
          title={text} 
          onClose={() => setIsOpen(false)} 
          onSave={handleSave} 
          options={options} 
          initialSelected={savedFilters}
        />
      )}
    </div>
  );
}
