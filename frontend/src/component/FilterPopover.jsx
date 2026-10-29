import React, { useState, useEffect } from 'react'; // Добавили useEffect

export default function FilterPopover({ title, onClose, onSave, options, initialSelected = [] }) {
  const [selectedItems, setSelectedItems] = useState(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');

  // Синхронизируем локальное состояние, если initialSelected изменился извне (например, сбросили фильтр)
  useEffect(() => {
    setSelectedItems(initialSelected);
  }, [initialSelected]);

  const handleCheckboxChange = (itemName) => {
    if (selectedItems.includes(itemName)) {
      setSelectedItems(selectedItems.filter((item) => item !== itemName));
    } else {
      setSelectedItems([...selectedItems, itemName]);
    }
  };

  return (
    <div className="filter-popover">

      {/* Шапка */}
      <div className="popover-header">
        <h3 className="popover-title text-20b">{title}</h3>
        <button className="popover-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Поиск */}
      <div className="field">
        <input
          type="text"
          className="field__input"
          placeholder=" "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label className="field__label">Введите {title.toLowerCase()}...</label>
        <svg className="field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Список чекбоксов */}
      <div className="popover-list">
        {Object.entries(options).map(([groupName, items]) => {
          // Проверка, что items — это массив (защита от ошибок)
          if (!Array.isArray(items)) return null;

          const filteredItems = items.filter(item => 
            item.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={groupName} className="popover-group">
              {/* Буква группы (кроме служебных заголовков) */}
              {groupName !== "Все предметы" && groupName !== "Все города" && (
                <span className="popover-group-letter">{groupName}</span>
              )}
              
              {filteredItems.map((item, idx) => (
                <label key={idx} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={selectedItems.includes(item)}
                    onChange={() => handleCheckboxChange(item)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="text-14r">{item}</span>
                </label>
              ))}
            </div>
          );
        })}

        {/* Проверка, если ничего не найдено */}
        {Object.values(options).flat().filter(item => 
          typeof item === 'string' && item.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
          <p className="text-14r" style={{ color: 'var(--gray)', textAlign: 'center', marginTop: '20px' }}>
            Ничего не найдено
          </p>
        )}
      </div>

      {/* Кнопка Сохранить */}
      <div className="popover-footer">
        <button
          className="btn btn--green text-14m"
          onClick={() => onSave(selectedItems)}
        >
          Сохранить
        </button>
      </div>

    </div>
  );
}