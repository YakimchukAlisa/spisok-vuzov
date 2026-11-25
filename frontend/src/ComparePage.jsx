import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ratingsData from './DATA/ratings.json'; // только для Минобрнауки
import { getVuzes, getRatings, getPassingScores } from './api/api.js';
import './css/comparePage.css';

const MEDIA_CATEGORIES = [
    { key: 'consolidated', label: 'Сводный рейтинг' },
    { key: 'smi',          label: 'СМИ' },
    { key: 'social',       label: 'Социальные сети' }, // категории пока нет в БД
    { key: 'site',         label: 'Сайт' },            // категории пока нет в БД
];

export default function ComparePage() {
    const location = useLocation();

    const [vuzData, setVuzData] = useState([]);
    const [isVuzLoading, setIsVuzLoading] = useState(true);
    const [ratings, setRatings] = useState([]);
    const [isRatingsLoading, setIsRatingsLoading] = useState(true);
    const [passingScores, setPassingScores] = useState([]);

    // M-RATE: вкладка, поиск, пагинация — как на странице рейтингов
    const [activeMediaTab, setActiveMediaTab] = useState('consolidated');
    const [searchMedia, setSearchMedia] = useState('');
    const [visibleMedia, setVisibleMedia] = useState(5);

    // RAEX: поиск и пагинация
    const [searchRaex, setSearchRaex] = useState('');
    const [visibleRaex, setVisibleRaex] = useState(5);

    const queryParams = new URLSearchParams(location.search);
    const idsString = queryParams.get('ids');
    const selectedIds = idsString ? idsString.split(',').map(Number) : [];

    useEffect(() => {
        if (selectedIds.length === 0) {
            setIsVuzLoading(false);
            setIsRatingsLoading(false);
            return;
        }
        Promise.all([getVuzes(), getRatings(selectedIds), getPassingScores(selectedIds)])
            .then(([vuzRes, ratingRes, passingRes]) => {
                setVuzData(vuzRes.data);
                setRatings(ratingRes.data);
                setPassingScores(passingRes.data);
            })
            .catch(err => console.error('Ошибка загрузки данных:', err))
            .finally(() => {
                setIsVuzLoading(false);
                setIsRatingsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idsString]);

    const selectedVuzes = useMemo(() => {
        if (isVuzLoading || vuzData.length === 0) return [];
        return selectedIds
            .map(id => vuzData.find(v => v.id === id))
            .filter(Boolean)
            .slice(0, 4);
    }, [selectedIds, vuzData, isVuzLoading]);

    // Имя вуза по ID — для строк рейтинга
    const nameOf = (vuzId) =>
        selectedVuzes.find(v => v.id === vuzId)?.name || `Вуз #${vuzId}`;

    // --- RAEX: только выбранные вузы, как таблица на странице рейтингов ---
    const raexRows = useMemo(() => {
        const q = searchRaex.trim().toLowerCase();
        return ratings
            .filter(r => r.source === 'RAEX' && r.category === 'consolidated' && r.vuzId != null)
            .map(r => ({ ...r, name: nameOf(r.vuzId) }))
            .filter(item => !q || item.name.toLowerCase().includes(q))
            .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ratings, searchRaex, selectedVuzes]);

    // --- M-RATE: вкладки, только выбранные вузы, полоски по баллу ---
    const mediaRows = useMemo(() => {
        const q = searchMedia.trim().toLowerCase();
        return ratings
            .filter(r => r.source === 'M-RATE' && r.category === activeMediaTab && r.vuzId != null)
            .map(r => ({ ...r, name: nameOf(r.vuzId) }))
            .filter(item => !q || item.name.toLowerCase().includes(q))
            .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ratings, searchMedia, activeMediaTab, selectedVuzes]);

    useEffect(() => { setVisibleRaex(5); }, [searchRaex]);
    useEffect(() => { setVisibleMedia(5); }, [searchMedia, activeMediaTab]);

    if (!isVuzLoading && selectedVuzes.length === 0) {
        return (
            <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <h1 className="text-32b">Ничего не выбрано для сравнения</h1>
                <Link to="/favorites" className="btn btn--green" style={{ marginTop: '20px' }}>
                    Вернуться в избранное
                </Link>
            </div>
        );
    }

    const getMinobrRank = (vuzId) => {
        const ratingItem = ratingsData.minobrnauki.find(r => r.vuzId === vuzId);
        return ratingItem ? `${ratingItem.rank} место` : '—';
    };

    const getPassing = (vuzId, key) => {
        const item = passingScores.find(p => p.vuzId === vuzId);
        return item && item[key] != null ? Math.round(item[key]) : '—';
    };

    const features = [
        { label: 'Название вуза', getValue: (v) => v.name },
        { label: 'Общежитие', getValue: (v) => v.features?.includes('Общежитие') ? 'Да' : 'Нет' },
        { label: 'Военная кафедра', getValue: (v) => v.features?.includes('Военный учебный центр') ? 'Да' : 'Нет' },
        { label: 'Бюджетные места', getValue: (v) => v.budget?.places || '—' },
        { label: 'Платные места', getValue: (v) => v.paid?.places || '—' },
        { label: 'Средний проходной на бюджет', getValue: (v) => getPassing(v.id, 'avgBudget') },
        { label: 'Средний проходной на платное', getValue: (v) => getPassing(v.id, 'avgPaid') },
        { label: 'Стоимость обучения', getValue: (v) => v.paid?.minPrice ? `${new Intl.NumberFormat('ru-RU').format(v.paid.minPrice)} ₽` : '—' },
    ];

    return (
        <div className="wrapper">
            <div className="container" style={{ padding: '40px 20px', marginBottom: '100px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="text-32b">Сравнение ВУЗов</h1>
                    <Link to="/favorites" className="btn btn--green-outline text-14m">
                        Назад в избранное
                    </Link>
                </div>

                {/* ОСНОВНАЯ ТАБЛИЦА */}
                <div className='title_and_content'>
                    <h2 className="text-28sm">Общая информация</h2>
                    <div className="compare-table">
                        <div className="compare-table__header">
                            <div className="compare-table__cell compare-table__cell--empty">Вуз</div>
                            {features.slice(1).map((feat, idx) => (
                                <div key={idx} className="compare-table__cell">{feat.label}</div>
                            ))}
                        </div>
                        <div className="compare-table__body">
                            {selectedVuzes.map(vuz => (
                                <div key={vuz.id} className="compare-table__row">
                                    <div className="compare-table__cell compare-table__cell--vuz-name">
                                        {vuz.name}
                                    </div>
                                    {features.slice(1).map((feat, idx) => (
                                        <div key={idx} className="compare-table__cell">
                                            {feat.getValue(vuz)}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* БЛОК 1: RAEX — как на странице рейтингов, но только выбранные вузы */}
                <section className="rating-section" style={{ marginTop: '60px' }}>
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

                            {isRatingsLoading ? (
                                <div className="rating-table__row" style={{ justifyContent: 'center' }}>
                                    <p className="text-20r" style={{ color: 'var(--gray)', padding: '20px' }}>Загрузка...</p>
                                </div>
                            ) : raexRows.length > 0 ? (
                                raexRows.slice(0, visibleRaex).map((item, idx) => (
                                    <div key={`${item.source}-${item.vuzId}-${idx}`} className="rating-table__row">
                                        <div className="rating-table__cell">{item.rank}</div>
                                        <div className="rating-table__cell">{item.name}</div>
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
                                    <p className="text-20r" style={{ color: 'var(--gray)', padding: '20px' }}>
                                        Выбранные вузы отсутствуют в рейтинге RAEX
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rating-buttons">
                        {visibleRaex < raexRows.length && (
                            <>
                                <button className="btn btn--green-outline" onClick={() => setVisibleRaex(v => v + 5)}>
                                    Загрузить ещё
                                </button>
                                <button className="btn btn--green" onClick={() => setVisibleRaex(raexRows.length)}>
                                    Показать все
                                </button>
                            </>
                        )}
                    </div>
                </section>

                {/* БЛОК 2: M-RATE — вкладки как на странице рейтингов, только выбранные вузы */}
                <section className="rating-section" style={{ marginTop: '60px' }}>
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
                            {isRatingsLoading ? (
                                <p className="text-20r" style={{ color: 'var(--gray)', textAlign: 'center' }}>Загрузка...</p>
                            ) : mediaRows.length > 0 ? (
                                mediaRows.slice(0, visibleMedia).map((item, idx) => {
                                    const maxScore = Math.max(...mediaRows.map(m => m.score || 0), 1);
                                    const percent = item.score != null ? (item.score / maxScore) * 100 : 0;
                                    return (
                                        <div key={`${item.source}-${item.vuzId}-${idx}`} className="media-bar-row">
                                            <span className="text-14r" style={{ width: '250px' }}>{item.name}</span>
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
                                <p className="text-20r" style={{ color: 'var(--gray)', textAlign: 'center' }}>
                                    Выбранные вузы отсутствуют в этой категории
                                </p>
                            )}
                        </div>

                        <div className="rating-buttons" style={{ marginTop: '32px' }}>
                            {visibleMedia < mediaRows.length && (
                                <>
                                    <button className="btn btn--green-outline" onClick={() => setVisibleMedia(v => v + 5)}>
                                        Загрузить ещё
                                    </button>
                                    <button className="btn btn--green" onClick={() => setVisibleMedia(mediaRows.length)}>
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
