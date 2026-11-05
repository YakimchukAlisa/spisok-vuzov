import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from './component/FavoritesContext.jsx';
import VuzCard from './component/VuzCard';
import FacultyCard from './component/FacultyCard';
import DirectionCard from './component/DirectionCard';
import './css/favoritesPage.css';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('vuzes');
  const [searchQuery, setSearchQuery] = useState('');

  // Массив выбранных для сравнения вузов
  const [selectedVuzes, setSelectedVuzes] = useState([]);

  const tabs = [
    { id: 'vuzes', label: 'Вузы' },
    { id: 'faculties', label: 'Факультеты' },
    { id: 'specialties', label: 'Специальности' }
  ];

  // --- ЛОГИКА ДЛЯ ВУЗОВ ---
  const currentVuzes = favorites.vuzes || [];
  const filteredVuzes = currentVuzes.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Выбрать все / Снять все
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVuzes(filteredVuzes.map(v => v.id));
    } else {
      setSelectedVuzes([]);
    }
  };

  // Выбрать один вуз
  const handleSelectVuz = (id) => {
    if (selectedVuzes.includes(id)) {
      setSelectedVuzes(selectedVuzes.filter(vId => vId !== id));
    } else {
      setSelectedVuzes([...selectedVuzes, id]);
    }
  };

  // Сброс поиска при смене вкладки
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery('');
  };

  // Фильтрация для факультетов и специальностей
  const filteredFaculties = (favorites.faculties || []).filter(f =>
    f.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSpecialties = (favorites.specialties || []).filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="wrapper">
      <div className="container" style={{ marginTop: '100px', marginBottom: '100px', gap: '32px'}}>

        {/* Заголовок */}
        <h1 className="text-32b">Избранное</h1>

        {/* Вкладки */}
        <div className="favorites-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`favorites-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label} ({favorites[tab.id]?.length || 0})
            </button>
          ))}
        </div>

        {/* ПАНЕЛЬ УПРАВЛЕНИЯ (Поиск и Сравнение) */}
        <div className="favorites-controls">

          {/* Строка 1: Поиск */}
          <div className="field favorites-search">
            <input
              type="text"
              className="field__input"
              placeholder=" "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <label className="field__label">
              Поиск {activeTab === 'vuzes' ? 'вуза' : activeTab === 'faculties' ? 'факультета' : 'специальности'}...
            </label>
            <img src="/search.svg" alt="Поиск" className="field__icon" />
          </div>

          {/* Строка 2: Чекбокс и кнопка (только для вкладки Вузы) */}
          {activeTab === 'vuzes' && (
            <div className="favorites-controls__actions">
              {/* Чекбокс "Выбрать все" */}
              <label className="favorites-checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={selectedVuzes.length > 0 && selectedVuzes.length === filteredVuzes.length}
                  onChange={handleSelectAll}
                />
                <span className="checkbox-custom"></span>
                <span className="text-14r">Выбрать все</span>
              </label>

              {/* Кнопка Сравнить */}
              <button
                // Если меньше 2 вузов - серая, если 2 и больше - зеленая
                className={`btn text-14m ${selectedVuzes.length < 2 ? 'btn--gray-dark' : 'btn--green'}`}
                disabled={selectedVuzes.length < 2}
                onClick={() => {
                  const idsString = selectedVuzes.join(',');
                  navigate(`/compare?ids=${idsString}`);
                }}
              >
                Сравнить
              </button>
            </div>
          )}
        </div>

        {/* КОНТЕНТ */}
        <div className="favorites-content">

          {/* Вкладка: Вузы */}
          {activeTab === 'vuzes' && (
            <div className="vuz-list">
              {filteredVuzes.length === 0 ? (
                <p className="text-20r" style={{ color: 'var(--gray)' }}>Ничего не найдено.</p>
              ) : (
                filteredVuzes.map(vuz => (
                  <VuzCard
                    key={vuz.id}
                    data={vuz}
                    showCheckbox={true} // Включаем чекбокс
                    isChecked={selectedVuzes.includes(vuz.id)} // Проверяем, выбран ли
                    onCheck={() => handleSelectVuz(vuz.id)} // Обработчик клика
                  />
                ))
              )}
            </div>
          )}

          {/* Вкладка: Факультеты */}
          {activeTab === 'faculties' && (
            <div className="professions-block__list">
              {filteredFaculties.length === 0 ? (
                <p className="text-20r" style={{ color: 'var(--gray)' }}>Ничего не найдено.</p>
              ) : (
                filteredFaculties.map(fac => (
                  <FacultyCard key={fac.id} data={fac} showVuzName={true} showCheckbox={true} />
                ))
              )}
            </div>
          )}

          {/* Вкладка: Специальности */}
          {activeTab === 'specialties' && (
            <div className="professions-block__list">
              {filteredSpecialties.length === 0 ? (
                <p className="text-20r" style={{ color: 'var(--gray)' }}>Ничего не найдено.</p>
              ) : (
                filteredSpecialties.map(spec => (
                  <DirectionCard key={spec.id} data={spec} isGlobal={true} showVuzName={true} showCheckbox={true} />
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}