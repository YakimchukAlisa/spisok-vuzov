import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFavorites } from './FavoritesContext.jsx';
import vuzData from './../DATA/cardVuz.json';
import './../css/directionCard.css';

// 👇 ДОБАВИЛИ ПРОПС showVuzName 👇
export default function DirectionCard({ data, facultyLogo, isGlobal = false, showVuzName = false }) {
    const { isAuth, favorites, toggleFavorite } = useFavorites();
    const { vuzId, facultyId } = useParams();

    if (!data) return null;

    const isFavorite = favorites.specialties.some(s => s.id === data.id);
    const currentVuzId = vuzId || data.vuzId;

    // Ищем вуз только если нужно его показать
    const vuz = showVuzName ? vuzData.find(v => v.id === Number(currentVuzId)) : null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    let linkPath = `/specialty/${data.id}`;
    if (!isGlobal && vuzId && facultyId) {
        linkPath = `/vuz/${vuzId}/faculty/${facultyId}/direction/${data.id}`;
    }

    return (
        <div className="direction-card">
            <div className="direction-card__main">
                <div className="direction-card__header">
                    {facultyLogo && (
                        <img src={facultyLogo} alt="Логотип" className="direction-card__logo" />
                    )}
                    <div className="direction-card__title-block">
                        <h3 className="direction-card__title">{data.name}</h3>
                        <p className="direction-card__code">
                            {data.code} {data.code_name}
                        </p>

                        {/* 👇 ВЫВОДИМ ВУЗ, ТОЛЬКО ЕСЛИ ПЕРЕДАН ПРОПС 👇 */}
                        {showVuzName && vuz && (
                            <p className="text-14m" style={{ color: 'var(--green)', marginTop: '8px' }}>
                                {vuz.name}
                            </p>
                        )}
                    </div>
                </div>

                   {data.description && (
                                    <div className="direction-card__description">
                                        <p className="text-14r">{data.description}</p>
                                    </div>
                                )}

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

            <div className="direction-card__stats-wrapper">
                <div className="direction-card__divider"></div>
                <div className="direction-card__stats">
                    <div className="direction-card__stat-group">
                        <span className="text-14m" style={{ color: 'var(--green)' }}>Бюджет</span>
                        <span className="text-14r">
                            <span className="text-14b"> {data.educationForms?.fullTime?.budget?.places || 0}</span> мест
                        </span>
                        <span className="text-14r">
                            от <span className="text-14b"> {data.educationForms?.fullTime?.budget?.minScore || 0}</span> баллов
                        </span>
                    </div>

                    <div className="direction-card__stat-group">
                        <span className="text-14m" style={{ color: 'var(--green)' }}>Платно</span>
                        <span className="text-14r">
                            <span className="text-14b"> {data.educationForms?.fullTime?.paid?.places || 0}</span> мест
                        </span>
                        <span className="text-14r">
                            от <span className="text-14b"> {data.educationForms?.fullTime?.paid?.minScore || 0}</span> баллов
                        </span>
                        <span className="text-14r">
                            от <span className="text-14b"> {data.educationForms?.fullTime?.paid?.minPrice ? formatPrice(data.educationForms.fullTime.paid.minPrice) : '0'}</span> ₽
                        </span>
                    </div>
                </div>
            </div>

            <div className="direction-card__actions">
                <Link to={linkPath} className="btn btn--green direction-card__btn">
                    Подробнее
                </Link>

                {isAuth && (
                    <button
                        className={`direction-card__favorite ${isFavorite ? 'is-active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite('specialties', {
                                ...data,
                                vuzId: currentVuzId,
                                facultyId: facultyId || data.facultyId
                            });
                        }}
                        title={isFavorite ? "Убрать из избранного" : "В избранное"}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24"
                            fill={isFavorite ? "var(--green)" : "none"}
                            stroke="var(--green)"
                            strokeWidth="2"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}