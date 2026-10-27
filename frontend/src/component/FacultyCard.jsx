import { Link, useParams } from 'react-router-dom';
import React, { useState } from 'react';

export default function FacultyCard({ data }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const { id: vuzId } = useParams(); 

    if (!data) return null;

    // Защита от падения (дефолтные значения)
    const bachelor = data.bachelor || { directions: 0, budgetPlaces: 0, paidPlaces: 0, minPrice: 0 };
    const master = data.master || { directions: 0, budgetPlaces: 0, paidPlaces: 0, minPrice: 0 };

    const name = data.shortName || data.name || 'Без названия';
    const logo = data.imageUrl || data.logoUrl;
    const description = data.fullName || data.description || 'Описание пока отсутствует.';

    const formatPrice = (price) => {
        if (!price) return '0';
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    return (
        <div className="faculty-card">
            {/* ЛЕВАЯ ЧАСТЬ */}
            <div className="faculty-card__main">
                <div className="faculty-card__header">
                    {logo && (
                        <img src={logo} alt={name} className="faculty-card__logo" />
                    )}
                    <div className="faculty-card__title-block">
                        <h3 className="faculty-card__short-name">{name}</h3>
                    </div>
                </div>

                {/* Вместо workPlaces выводим описание из БД */}
                <div className="faculty-card__work">
                    <span className="faculty-card__work-title">Где работать?</span>
                    <p className="text-14r" style={{ marginTop: '8px', color: 'var(--gray)' }}>
                        {description}
                    </p>
                </div>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Статистика */}
            <div className="faculty-card__stats-wrapper">
                <div className="faculty-card__divider"></div>
                <div className="faculty-card__stats">
                    <div className="faculty-card__stat-group">
                        <span className="faculty-card__stat-title text-14m">Бакалавриат</span>
                        <span className="text-14b">{bachelor.directions} <span className="text-14r">направлений</span></span>
                        <span className="text-14b">{bachelor.budgetPlaces} <span className="text-14r">бюджетных мест</span></span>
                        <span className="text-14b">{bachelor.paidPlaces} <span className="text-14r">платных мест</span></span>
                        <span className="text-14r">от <span className="text-14b">{formatPrice(bachelor.minPrice)}</span> ₽</span>
                    </div>
                    <div className="faculty-card__stat-group">
                        <span className="faculty-card__stat-title text-14m">Магистратура</span>
                        <span className="text-14b">{master.directions} <span className="text-14r">направлений</span></span>
                        <span className="text-14b">{master.budgetPlaces} <span className="text-14r">бюджетных мест</span></span>
                        <span className="text-14b">{master.paidPlaces} <span className="text-14r">платных мест</span></span>
                        <span className="text-14r">от <span className="text-14b">{formatPrice(master.minPrice)}</span> ₽</span>
                    </div>
                </div>
            </div>

            <div className="faculty-card__actions">
                <Link
                    to={`/vuz/${vuzId}/faculty/${data.id}`}
                    className="btn btn--green faculty-card__btn"
                >
                    Подробнее
                </Link>
                <button
                    className={`faculty-card__favorite ${isFavorite ? 'is-active' : ''}`}
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