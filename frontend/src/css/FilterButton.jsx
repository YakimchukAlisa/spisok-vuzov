import React, { useState, useRef, useEffect } from 'react';
import FilterPopover from './FilterPopover'; 

// Добавили selectedValues и onChange в пропсы
export default function FilterButton({ text, iconSrc, options, selectedValues = [], onChange }) {
  const [isOpen, setIsOpen] = useState(false);
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
    onChange(selectedItems); // Передаем выбранные элементы наверх в App.jsx
    setIsOpen(false);
  };

  const handleReset = (e) => {
    e.stopPropagation(); // Останавливаем всплытие, чтобы не открывался попап
    onChange([]); // Очищаем фильтры наверху в App.jsx
    setIsOpen(false); // Закрываем попап
  };

  return (
    <div className="filter-wrapper" ref={wrapperRef}>
      
      <button 
        // Если есть выбранные элементы, кнопка становится темной
        className={`btn btn--with-icon ${selectedValues.length > 0 ? 'btn--gray-dark' : 'btn--gray-light'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {iconSrc && <img src={iconSrc} alt={text} className="btn__icon-left" />}
        <span>{text} {selectedValues.length > 0 ? `(${selectedValues.length})` : ''}</span>
        
        {/* Место под крестик */}
        <div className="btn__icon-right">
          {selectedValues.length > 0 && (
             <img 
               src="/close.svg" 
               alt="Сбросить фильтр" 
               onClick={handleReset} 
               style={{ cursor: 'pointer' }}
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
          initialSelected={selectedValues} // Передаем текущие выбранные значения в попап
        />
      )}
    </div>
  );
}