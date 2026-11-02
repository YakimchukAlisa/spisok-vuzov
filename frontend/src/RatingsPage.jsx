import React, { useState, useMemo } from 'react';
import ratingsData from './DATA/ratings.json';
import './css/ratingsPage.css';

export default function RatingsPage() {
  const [activeMediaTab, setActiveMediaTab] = useState('summary');

  // Состояния для поиска
  const [searchRaex, setSearchRaex] = useState('');
  const [searchMinobr, setSearchMinobr] = useState('');
  const [searchMedia, setSearchMedia] = useState('');

  // Состояния для количества
  const [visibleRaex, setVisibleRaex] = useState(5);
  const [visibleMinobr, setVisibleMinobr] = useState(5);
  const [visibleMedia, setVisibleMedia] = useState(5);

  const showMoreRaex = () => setVisibleRaex(prev => prev + 5);
  const showMoreMinobr = () => setVisibleMinobr(prev => prev + 5);
  const showMoreMedia = () => setVisibleMedia(prev => prev + 5);

  // Фильтрация данных
  const filteredRaex = useMemo(() => 
    ratingsData.raex.filter(v => v.name.toLowerCase().includes(searchRaex.toLowerCase())), 
  [searchRaex]);

  const filteredMinobr = useMemo(() => 
    ratingsData.minobrnauki.filter(v => v.name.toLowerCase().includes(searchMinobr.toLowerCase())), 
  [searchMinobr]);

  // 👇 ИСПРАВЛЕНИЕ 2: Добавляем страховку (?.), если вдруг данных нет
  const filteredMedia = useMemo(() => {
    const currentMediaData = ratingsData.media[activeMediaTab] || [];
    return currentMediaData.filter(v => v.name.toLowerCase().includes(searchMedia.toLowerCase()));
  }, [searchMedia, activeMediaTab]);

  return (
    <div className="wrapper">
      <div className="container" style={{ marginTop: '100px', marginBottom: '100px' }}>
        
        {/* БЛОК 1: РЕЙТИНГ RAEX */}
        <section className="rating-section">
          <h2 className="text-32b" style={{ marginBottom: '24px' }}>Рейтинг RAEX</h2>
          
          <div className="field" style={{ marginBottom: '24px'}}>
            <input
              type="text"
              className="field__input"
              placeholder=" "
              value={searchRaex}
              onChange={(e) => setSearchRaex(e.target.value)}
            />
            <label className="field__label">Поиск вуза в рейтинге RAEX...</label>
            <img src="/search.svg" alt="Поиск" className="field__icon" />
          </div>

          <div className="rating-table-wrapper">
            <div className="rating-table">
              <div className="rating-table__header">
                <div className="rating-table__cell" style={{ width: '10%' }}>Место</div>
                <div className="rating-table__cell" style={{ flexGrow: 1, textAlign: 'left' }}>Вуз</div>
                <div className="rating-table__cell" style={{ width: '20%' }}>Балл</div>
              </div>
              
              {filteredRaex.length > 0 ? (
                filteredRaex.slice(0, visibleRaex).map((item) => (
                  <div key={item.id} className="rating-table__row">
                    <div className="rating-table__cell" style={{ width: '10%' }}>{item.rank}</div>
                    <div className="rating-table__cell" style={{ flexGrow: 1, textAlign: 'left' }}>{item.name}</div>
                    <div className="rating-table__cell" style={{ width: '20%' }}>{item.score}</div>
                  </div>
                ))
              ) : (
                <div className="rating-table__row" style={{ justifyContent: 'center' }}>
                   <p className="text-20r" style={{ color: 'var(--gray)', padding: '20px' }}>Вузы не найдены</p>
                </div>
              )}
            </div>
          </div>

          <div className="rating-buttons">
            {visibleRaex < filteredRaex.length && (
              <button className="btn btn--green-outline" onClick={showMoreRaex}>Загрузить ещё</button>
            )}
            {visibleRaex < filteredRaex.length && (
              <button className="btn btn--green" onClick={() => setVisibleRaex(filteredRaex.length)}>Показать все</button>
            )}
          </div>
        </section>

        {/* БЛОК 2: РЕЙТИНГ МИНОБРНАУКИ */}
        <section className="rating-section">
          <h2 className="text-32b" style={{ marginBottom: '24px' }}>Рейтинг Минобрнауки</h2>
          
          <div className="field" style={{ marginBottom: '24px'}}>
            <input
              type="text"
              className="field__input"
              placeholder=" "
              value={searchMinobr}
              onChange={(e) => setSearchMinobr(e.target.value)}
            />
            <label className="field__label">Поиск вуза в рейтинге Минобрнауки...</label>
            <img src="/search.svg" alt="Поиск" className="field__icon" />
          </div>

          <div className="rating-table-wrapper">
            <div className="rating-table">
              <div className="rating-table__header">
                <div className="rating-table__cell" style={{ width: '10%' }}>Место</div>
                <div className="rating-table__cell" style={{ flexGrow: 1, textAlign: 'left' }}>Вуз</div>
                <div className="rating-table__cell" style={{ width: '20%' }}>Балл</div>
              </div>
              
              {filteredMinobr.length > 0 ? (
                filteredMinobr.slice(0, visibleMinobr).map((item) => (
                  <div key={item.id} className="rating-table__row">
                    <div className="rating-table__cell" style={{ width: '10%' }}>{item.rank}</div>
                    <div className="rating-table__cell" style={{ flexGrow: 1, textAlign: 'left' }}>{item.name}</div>
                    <div className="rating-table__cell" style={{ width: '20%' }}>{item.score}</div>
                  </div>
                ))
              ) : (
                <div className="rating-table__row" style={{ justifyContent: 'center' }}>
                  <p className="text-20r" style={{ color: 'var(--gray)', padding: '20px' }}>Вузы не найдены</p>
                </div>
              )}
            </div>
          </div>

          <div className="rating-buttons">
            {visibleMinobr < filteredMinobr.length && (
              <button className="btn btn--green-outline" onClick={showMoreMinobr}>Загрузить ещё</button>
            )}
            {visibleMinobr < filteredMinobr.length && (
              <button className="btn btn--green" onClick={() => setVisibleMinobr(filteredMinobr.length)}>Показать все</button>
            )}
          </div>
        </section>

        {/* БЛОК 3: МЕДИА-РЕЙТИНГ */}
        <section className="rating-section">
          <h2 className="text-32b" style={{ marginBottom: '24px' }}>Медиа-рейтинг</h2>
          
          {/* 👇 ИСПРАВЛЕНИЕ 3: Обновляем вкладки под новые данные */}
          <div className="media-tabs">
            <button 
              className={`media-tab ${activeMediaTab === 'summary' ? 'active' : ''}`}
              onClick={() => { setActiveMediaTab('summary'); setVisibleMedia(5); setSearchMedia(''); }}
            >
              Сводный рейтинг
            </button>
            <button 
              className={`media-tab ${activeMediaTab === 'massMedia' ? 'active' : ''}`}
              onClick={() => { setActiveMediaTab('massMedia'); setVisibleMedia(5); setSearchMedia(''); }}
            >
              СМИ
            </button>
            <button 
              className={`media-tab ${activeMediaTab === 'socialMedia' ? 'active' : ''}`}
              onClick={() => { setActiveMediaTab('socialMedia'); setVisibleMedia(5); setSearchMedia(''); }}
            >
              Социальные сети
            </button>
            <button 
              className={`media-tab ${activeMediaTab === 'website' ? 'active' : ''}`}
              onClick={() => { setActiveMediaTab('website'); setVisibleMedia(5); setSearchMedia(''); }}
            >
              Сайт
            </button>
          </div>

          <div className="media-chart">
            <div className="field" style={{ marginBottom: '40px'}}>
              <input 
                type="text" 
                className="field__input" 
                placeholder=" " 
                value={searchMedia}
                onChange={(e) => setSearchMedia(e.target.value)}
              />
              <label className="field__label">Поиск вуза в рейтинге...</label>
              <img src="/search.svg" alt="Поиск" className="field__icon" />
            </div>

            <div className="media-bars">
              {filteredMedia.length > 0 ? (
                filteredMedia.slice(0, visibleMedia).map((item) => (
                  <div key={item.id} className="media-bar-row">
                    <span className="text-14r" style={{ width: '250px' }}>{item.name}</span>
                    <div className="media-bar-track">
                      <div 
                        className="media-bar-fill" 
                        style={{ width: `${item.employmentPercent}%` }}
                      >
                        <span className="media-bar-text">{item.employmentPercent}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-20r" style={{ color: 'var(--gray)', textAlign: 'center' }}>Вузы не найдены</p>
              )}
            </div>

            <div className="rating-buttons" style={{ marginTop: '32px' }}>
              {visibleMedia < filteredMedia.length && (
                <button className="btn btn--green-outline" onClick={showMoreMedia}>Загрузить ещё</button>
              )}
              {visibleMedia < filteredMedia.length && (
                <button className="btn btn--green" onClick={() => setVisibleMedia(filteredMedia.length)}>Показать все</button>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}