import React, { useState, useEffect, useMemo } from 'react';
import { getRaexRating, getMRateRating } from './api/api.js';
import './css/ratingsPage.css';

const MEDIA_CATEGORIES = [
  { key: 'consolidated', label: 'Сводный рейтинг' },
  { key: 'smi',          label: 'СМИ' },
  { key: 'social',       label: 'Социальные сети' },
  { key: 'site',         label: 'Сайт' },
];

export default function RatingsPage() {
  // --- RAEX ---
  const [raexData, setRaexData] = useState([]);
  const [isRaexLoading, setIsRaexLoading] = useState(true);
  const [raexError, setRaexError] = useState('');
  const [searchRaex, setSearchRaex] = useState('');
  const [visibleRaex, setVisibleRaex] = useState(5);

  // --- M-RATE ---
  const [activeMediaTab, setActiveMediaTab] = useState('consolidated');
  const [mediaData, setMediaData] = useState([]);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState('');
  const [searchMedia, setSearchMedia] = useState('');
  const [visibleMedia, setVisibleMedia] = useState(5);

  // --- Загрузка RAEX ---
  useEffect(() => {
    getRaexRating(2026)
      .then(data => { setRaexData(data); setIsRaexLoading(false); })
      .catch(err => {
        console.error('Ошибка загрузки RAEX:', err);
        setRaexError('Не удалось загрузить рейтинг RAEX');
        setIsRaexLoading(false);
      });
  }, []);

  // --- Загрузка M-RATE при смене вкладки ---
  useEffect(() => {
    setIsMediaLoading(true);
    setMediaError('');
    getMRateRating(activeMediaTab, 2026)
      .then(data => { setMediaData(data); setIsMediaLoading(false); })
      .catch(err => {
        console.error('Ошибка загрузки M-RATE:', err);
        setMediaError('Не удалось загрузить медиарейтинг');
        setIsMediaLoading(false);
      });
  }, [activeMediaTab]);

  // --- Фильтрация ---
  const filteredRaex = useMemo(() => {
    const q = searchRaex.trim().toLowerCase();
    if (!q) return raexData;
    return raexData.filter(v => (v.vuzName || '').toLowerCase().includes(q));
  }, [raexData, searchRaex]);

  const filteredMedia = useMemo(() => {
    const q = searchMedia.trim().toLowerCase();
    if (!q) return mediaData;
    return mediaData.filter(v => (v.vuzName || '').toLowerCase().includes(q));
  }, [mediaData, searchMedia]);

  // --- Сброс видимого количества при смене поиска/вкладки ---
  useEffect(() => { setVisibleRaex(5); }, [searchRaex]);
  useEffect(() => { setVisibleMedia(5); }, [searchMedia, activeMediaTab]);

  return (
    <div className="wrapper">
      <div className="container" style={{ marginTop: '100px', marginBottom: '100px' }}>

        {/* БЛОК 1: RAEX */}
        <section className="rating-section">
          <h2 className="text-32b" style={{ marginBottom: '24px' }}>Рейтинг RAEX</h2>

          <div className="field" style={{ marginBottom: '24px' }}>
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
              <div className="rating-table__cell">Место</div>
              <div className="rating-table__cell">Вуз</div>
              <div className="rating-table__cell">Место 2025</div>
              <div className="rating-table__cell">Балл</div>
              <div className="rating-table__cell">Условия</div>
              <div className="rating-table__cell">Востребованность</div>
              <div className="rating-table__cell">Наука</div>
            </div>

             {isRaexLoading ? (
               <div className="rating-table__row" style={{ justifyContent: 'center' }}>
                 <p className="text-20r" style={{ color: 'var(--gray)', padding: '20px' }}>Загрузка...</p>
               </div>
             ) : raexError ? (
               <div className="rating-table__row" style={{ justifyContent: 'center' }}>
                 <p className="text-20r" style={{ color: 'red', padding: '20px' }}>{raexError}</p>
               </div>
             ) : filteredRaex.length > 0 ? (
               filteredRaex.slice(0, visibleRaex).map((item, idx) => (
                 <div key={`${item.vuzName}-${item.rank}-${idx}`} className="rating-table__row">
                   <div className="rating-table__cell">{item.rank}</div>
                   <div className="rating-table__cell">{item.vuzName}</div>
                   <div className="rating-table__cell">{item.lastYearRank || '—'}</div>
                   <div className="rating-table__cell">
                     {item.score != null ? Number(item.score).toFixed(4) : '—'}
                   </div>
                   <div className="rating-table__cell">{item.educationRank ?? '—'}</div>
                   <div className="rating-table__cell">{item.demandRank ?? '—'}</div>
                   <div className="rating-table__cell">{item.scienceRank ?? '—'}</div>
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
              <>
                <button className="btn btn--green-outline" onClick={() => setVisibleRaex(v => v + 5)}>
                  Загрузить ещё
                </button>
                <button className="btn btn--green" onClick={() => setVisibleRaex(filteredRaex.length)}>
                  Показать все
                </button>
              </>
            )}
          </div>
        </section>

        {/* БЛОК 2: M-RATE */}
        <section className="rating-section">
          <h2 className="text-32b" style={{ marginBottom: '24px' }}>Медиарейтинг</h2>

          <div className="media-tabs">
            {MEDIA_CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`media-tab ${activeMediaTab === cat.key ? 'active' : ''}`}
                onClick={() => { setActiveMediaTab(cat.key); setSearchMedia(''); }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="media-chart">
            <div className="field" style={{ marginBottom: '40px' }}>
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
              {isMediaLoading ? (
                <p className="text-20r" style={{ color: 'var(--gray)', textAlign: 'center' }}>Загрузка...</p>
              ) : mediaError ? (
                <p className="text-20r" style={{ color: 'red', textAlign: 'center' }}>{mediaError}</p>
              ) : filteredMedia.length > 0 ? (
                filteredMedia.slice(0, visibleMedia).map((item, idx) => {
                  // Нормируем балл в проценты для ширины полосы
                  const maxScore = Math.max(...filteredMedia.map(m => m.score || 0), 1);
                  const percent = item.score != null ? (item.score / maxScore) * 100 : 0;
                  return (
                    <div key={`${item.vuzName}-${item.rank}-${idx}`} className="media-bar-row">
                      <span className="text-14r" style={{ width: '250px' }}>{item.vuzName}</span>
                      <div className="media-bar-track">
                        <div className="media-bar-fill" style={{ width: `${percent}%` }}>
                          <span className="media-bar-text">
                            {item.score != null ? Number(item.score).toFixed(2) : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-20r" style={{ color: 'var(--gray)', textAlign: 'center' }}>Вузы не найдены</p>
              )}
            </div>

            <div className="rating-buttons" style={{ marginTop: '32px' }}>
              {visibleMedia < filteredMedia.length && (
                <>
                  <button className="btn btn--green-outline" onClick={() => setVisibleMedia(v => v + 5)}>
                    Загрузить ещё
                  </button>
                  <button className="btn btn--green" onClick={() => setVisibleMedia(filteredMedia.length)}>
                    Показать все
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}