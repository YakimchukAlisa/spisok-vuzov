import React, { useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import vuzData from './DATA/cardVuz.json';
import ratingsData from './DATA/ratings.json';
import './css/comparePage.css';

export default function ComparePage() {
    const location = useLocation();

    // Состояния для медиа-рейтинга
    const [activeMediaTab, setActiveMediaTab] = useState('summary');
    const [searchMedia, setSearchMedia] = useState('');
    const [visibleMedia, setVisibleMedia] = useState(5);

    const queryParams = new URLSearchParams(location.search);
    const idsString = queryParams.get('ids');
    const selectedIds = idsString ? idsString.split(',').map(Number) : [];

    const selectedVuzes = useMemo(() => {
        return selectedIds
            .map(id => vuzData.find(v => v.id === id))
            .filter(Boolean)
            .slice(0, 4);
    }, [selectedIds]);

    // Собираем данные для медиа-рейтинга только из выбранных вузов
    const mediaDataForSelected = useMemo(() => {
        const currentCategoryData = ratingsData.media?.[activeMediaTab] || [];

        // Фильтруем по vuzId выбранных вузов
        const filtered = currentCategoryData.filter(item =>
            selectedVuzes.some(v => v.id === item.vuzId)
        );

        // Фильтруем по поисковому запросу
        return filtered.filter(item =>
            item.name.toLowerCase().includes(searchMedia.toLowerCase())
        );
    }, [activeMediaTab, searchMedia, selectedVuzes]);

    const showMoreMedia = () => setVisibleMedia(prev => prev + 5);

    if (selectedVuzes.length === 0) {
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

    const features = [
        { label: 'Название вуза', getValue: (v) => v.name },
        { label: 'Тип вуза', getValue: (v) => v.type || 'Государственный' },
        { label: 'Позиции по Минобрнауки', getValue: (v) => getMinobrRank(v.id) },
        { label: 'Общежитие', getValue: (v) => v.features?.includes('Общежитие') ? 'Да' : 'Нет' },
        { label: 'Военная кафедра', getValue: (v) => v.features?.includes('Военный учебный центр') ? 'Да' : 'Нет' },
        { label: 'Бюджетные места', getValue: (v) => v.budget?.places || '—' },
        { label: 'Платные места', getValue: (v) => v.paid?.places || '—' },
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
                            <div className="compare-table__cell compare-table__cell--empty">
                                Вуз
                            </div>
                            {features.slice(1).map((feat, idx) => (
                                <div key={idx} className="compare-table__cell">
                                    {feat.label}
                                </div>
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

                {/* 👇 БЛОК МЕДИА-РЕЙТИНГА 👇 */}
                <section className="rating-section" style={{ marginTop: '60px' }}>
                    <h2 className="text-32b" style={{ marginBottom: '24px' }}>Медиа-рейтинг</h2>

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
                            {mediaDataForSelected.length > 0 ? (
                                mediaDataForSelected.slice(0, visibleMedia).map((item) => (
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
                            {visibleMedia < mediaDataForSelected.length && (
                                <button className="btn btn--green-outline" onClick={showMoreMedia}>Загрузить ещё</button>
                            )}
                            {visibleMedia < mediaDataForSelected.length && (
                                <button className="btn btn--green" onClick={() => setVisibleMedia(mediaDataForSelected.length)}>Показать все</button>
                            )}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}