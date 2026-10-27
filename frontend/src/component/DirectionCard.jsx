import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './../css/directionCard.css';

export default function DirectionCard({ data, facultyLogo }) {
    const [isFavorite, setIsFavorite] = useState(false);

    if (!data) return null;

    const budgetPlaces = data.budgetPlaces || 0;
    const budgetMinScore = data.budgetMinScore || 0;
    const paidPlaces = data.paidPlaces || 0;
    const paidMinScore = data.paidMinScore || 0;
    const paidMinPrice = data.paidMinPrice || 0;

    const formatPrice = (price) => {
        if (!price) return '0';
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    return (
        <div className="direction-card">

            {/* ЛЕВАЯ ЧАСТЬ: Название, описание, предметы */}
            <div className="direction-card__main">
                <div className="direction-card__header">
                    {facultyLogo && (
                        <img src={facultyLogo} alt="Логотип" className="direction-card__logo" />
                    )}
                    <div className="direction-card__title-block">
                        <h3 className="direction-card__title">
                            {data.profileName || data.name}
                        </h3>

                        {/* КОД и НАЗВАНИЕ НАПРАВЛЕНИЯ мелким шрифтом */}
                        <p className="direction-card__code">
                            {data.kod} {data.napravlenieName || data.name}
                        </p>
                    </div>
                </div>

                {/* Описание (если есть) */}
                {data.opisanie && (
                    <div className="direction-card__description">
                        <p className="text-14r">{data.opisanie}</p>
                    </div>
                )}

                {/* 4. Экзамены */}
                {data.exams && data.exams.length > 0 && (
                    <div className="direction-card__exams">
                        {data.exams.map((exam, idx) => (
                            <div key={idx} className="direction-card__exam-item">
                                <span className="direction-card__exam-dot"></span>
                                <span className="text-14r">{exam}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Статистика */}
            <div className="direction-card__stats-wrapper">
                <div className="direction-card__divider"></div>
                <div className="direction-card__stats">
                    <div className="direction-card__stat-group">
                        <span className="text-14m" style={{ color: 'var(--green)' }}>Бюджет</span>
                        <span className="text-14r"><span className="text-14b"> {budgetPlaces}</span> мест</span>
                        <span className="text-14r">от <span className="text-14b"> {budgetMinScore}</span> баллов</span>
                    </div>
                    <div className="direction-card__stat-group">
                        <span className="text-14m" style={{ color: 'var(--green)' }}>Платно</span>
                        <span className="text-14r"><span className="text-14b"> {paidPlaces}</span> мест</span>
                        <span className="text-14r">от <span className="text-14b"> {paidMinScore}</span> баллов</span>
                        <span className="text-14r">от <span className="text-14b"> {formatPrice(paidMinPrice)}</span> ₽</span>
                    </div>
                </div>
            </div>

            {/* БЛОК С КНОПКАМИ (в самом низу карточки) */}
            <div className="direction-card__actions">
                <Link to="#" className="btn btn--green direction-card__btn">
                    Подробнее
                </Link>
                <button
                    className={`direction-card__favorite ${isFavorite ? 'is-active' : ''}`}
                    onClick={() => setIsFavorite(!isFavorite)}
                    title="В избранное"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "var(--green)" : "none"} stroke="var(--green)" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>

        </div>
    );
}