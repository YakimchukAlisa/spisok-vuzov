import { Link, useParams } from 'react-router-dom';
import React from 'react';
import { useFavorites } from './FavoritesContext.jsx'; 
import vuzData from './../DATA/cardVuz.json'; 
import './../css/facultyCard.css';

// 👇 ДОБАВИЛИ ПРОПС showVuzName 👇
export default function FacultyCard({ data, showVuzName = false }) {
    const { id: vuzIdFromUrl } = useParams(); 
    const { isAuth, favorites, toggleFavorite } = useFavorites(); 

    if (!data) return null;

    const isFavorite = favorites.faculties.some(f => f.id === data.id);
    const currentVuzId = vuzIdFromUrl || data.vuzId;
    
    // Ищем вуз только если нужно его показать (для экономии ресурсов)
    const vuz = showVuzName ? vuzData.find(v => v.id === Number(currentVuzId)) : null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    return (
        <div className="faculty-card">
            <div className="faculty-card__main">
                <div className="faculty-card__header">
                    {data.imageUrl && (
                        <img src={data.imageUrl} alt={data.shortName} className="faculty-card__logo" />
                    )}
                    <div className="faculty-card__title-block">
                        <h3 className="faculty-card__short-name">{data.shortName}</h3>
                        <p className="faculty-card__full-name">{data.fullName}</p>

                        {/* 👇 ВЫВОДИМ ВУЗ, ТОЛЬКО ЕСЛИ ПЕРЕДАН ПРОПС 👇 */}
                        {showVuzName && vuz && (
                            <p className="text-14m" style={{ color: 'var(--green)', marginTop: '8px' }}>
                                {vuz.name}
                            </p>
                        )}
                    </div>
                </div>

           <div className="faculty-card__work">
             <span className="faculty-card__work-title">Где работать?</span>
             <p
               style={{whiteSpace: 'pre-line' }}
             >
               {data.description || 'Информация пока отсутствует.'}
             </p>
           </div>
           </div>

            <div className="faculty-card__stats-wrapper">
                <div className="faculty-card__divider"></div>
                <div className="faculty-card__stats">
                    <div className="faculty-card__stat-group">
                        <span className="faculty-card__stat-title text-14m">Бакалавриат</span>
                        <span className="text-14b">{data.bachelor?.directions} <span className="text-14r">направлений</span></span>
                        <span className="text-14b">{data.bachelor?.budgetPlaces} <span className="text-14r">бюджетных мест</span></span>
                        <span className="text-14b">{data.bachelor?.paidPlaces} <span className="text-14r">платных мест</span></span>
                        <span className="text-14r">от <span className="text-14b">{formatPrice(data.bachelor?.minPrice)}</span> ₽</span>
                    </div>
                    <div className="faculty-card__stat-group">
                        <span className="faculty-card__stat-title text-14m">Магистратура</span>
                        <span className="text-14b">{data.master?.directions} <span className="text-14r">направлений</span></span>
                        <span className="text-14b">{data.master?.budgetPlaces} <span className="text-14r">бюджетных мест</span></span>
                        <span className="text-14b">{data.master?.paidPlaces} <span className="text-14r">платных мест</span></span>
                        <span className="text-14r">от <span className="text-14b">{formatPrice(data.master?.minPrice)}</span> ₽</span>
                    </div>
                </div>
            </div>

            <div className="faculty-card__actions">
                <Link to={`/vuz/${currentVuzId}/faculty/${data.id}`} className="btn btn--green faculty-card__btn">
                    Подробнее
                </Link>

                {isAuth && (
                    <button
                        className={`faculty-card__favorite ${isFavorite ? 'is-active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite('faculties', { ...data, vuzId: currentVuzId });
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