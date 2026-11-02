import React, { useState } from 'react';
import { useFavorites } from './component/FavoritesContext.jsx';
import VuzCard from './component/VuzCard.jsx';
import FacultyCard from './component/FacultyCard.jsx';
import DirectionCard from './component/DirectionCard.jsx'; // или ProfessionCard
import './css/favoritesPage.css';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('vuzes');

  const tabs = [
    { id: 'vuzes', label: 'Вузы' },
    { id: 'faculties', label: 'Факультеты' },
    { id: 'specialties', label: 'Специальности' }
  ];

  return (
    <div className="wrapper">
      <div className="container" style={{ marginTop: '100px', marginBottom: '100px' }}>
        <h1 className="text-32b" style={{ marginBottom: '32px' }}>Избранное</h1>

        {/* Вкладки */}
        <div className="favorites-tabs">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`favorites-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({favorites[tab.id].length})
            </button>
          ))}
        </div>

        {/* Контент вкладки */}
        <div className="favorites-content">
          {favorites[activeTab].length === 0 ? (
            <p className="text-20r" style={{ color: 'var(--gray)' }}>
              В этой категории пока ничего нет.
            </p>
          ) : (
            <div className="vuz-list">
              {activeTab === 'vuzes' && favorites.vuzes.map(vuz => <VuzCard key={vuz.id} data={vuz} />)}
              
              {activeTab === 'faculties' && favorites.faculties.map(fac => (
                // Для факультета нужно передать vuzId, чтобы ссылка работала
                <FacultyCard key={fac.id} data={fac} vuzId={fac.vuzId || 1} /> 
              ))}

              {activeTab === 'specialties' && favorites.specialties.map(spec => (
                <DirectionCard key={spec.id} data={spec} isGlobal={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}