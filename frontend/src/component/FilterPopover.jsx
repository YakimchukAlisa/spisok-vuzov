import React, { useState } from 'react';

export default function FilterPopover({ title, onClose, onSave, options, initialSelected = [] }) {
  // Передаем сохраненные элементы как начальное состояние
  const [selectedItems, setSelectedItems] = useState(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');  // Состояние для поиска внутри фильтра

  const handleCheckboxChange = (itemName) => {
    if (selectedItems.includes(itemName)) {
      setSelectedItems(selectedItems.filter((item) => item !== itemName));
    } else {
      setSelectedItems([...selectedItems, itemName]);
    }
  };

  return (
    <div className="filter-popover">

      {/* Шапка с заголовком и крестиком закрытия */}
      <div className="popover-header">
        <h3 className="popover-title text-20b">{title}</h3>
        <button className="popover-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Поле поиска */}
      <div className="field">
        <input
          type="text"
          className="field__input"
          placeholder=" "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Обновляем поисковый запрос
        />
        <label className="field__label">Введите {title.toLowerCase()}...</label>
        <svg className="field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Скроллируемый список чекбоксов (динамический) */}
      <div className="popover-list">
        {/* Перебираем группы (А, Б, В...) из переданного JSON */}
        {Object.entries(options).map(([groupName, items]) => {
          
          // Фильтруем элементы внутри группы по поиску (если поиск пустой, покажет всё)
          const filteredItems = items.filter(item => 
            item.toLowerCase().includes(searchTerm.toLowerCase())
          );

          // Если в группе ничего не найдено по поиску — не рендерим заголовок группы
          if (filteredItems.length === 0) return null;

          return (
            <div key={groupName} className="popover-group">
              {/* Буква группы. Скрываем для "Все предметы" и "Все города" */}
              {groupName !== "Все предметы" && groupName !== "Все города" && (
                <span className="popover-group-letter">{groupName}</span>
              )}
              
              {/* Перебираем отфильтрованные элементы */}
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

        {/* Если поиск ничего не дал во всех группах */}
        {Object.values(options).flat().filter(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase())
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
