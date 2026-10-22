import React from 'react';

export default function FacultyCard({ data }) {
    if (!data) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    return (
        <div className="faculty-card">

            {/* ЛЕВАЯ ЧАСТЬ: Информация */}
            <div className="faculty-card__main">

                {/* Шапка факультета */}
                <div className="faculty-card__header">
                    {data.imageUrl && (
                        <img src={data.imageUrl} alt={data.shortName} className="faculty-card__logo" />
                    )}
                    <div className="faculty-card__title-block">
                        <h3 className="faculty-card__short-name">{data.shortName}</h3>
                        <p className="faculty-card__full-name">{data.fullName}</p>
                    </div>
                </div>

                {/* Где работать */}
                <div className="faculty-card__work">
                    <span className="faculty-card__work-title">Где работать?</span>
                    <ul className="faculty-card__work-list">
                        {data.workPlaces?.map((place, index) => (
                            <li key={index}>- {place}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Статистика */}
            <div className="faculty-card__stats-wrapper">
                <div className="faculty-card__divider"></div>
                <div className="faculty-card__stats">
                    {/* Бакалавриат */}
                    <div className="faculty-card__stat-group">
                        <span className="faculty-card__stat-title text-14m">Бакалавриат</span>
                        <span className="text-14b">{data.bachelor.directions} <span className="text-14r">направлений</span></span>
                        <span className="text-14b">{data.bachelor.budgetPlaces} <span className="text-14r">бюджетных мест</span></span>
                        <span className="text-14b">{data.bachelor.paidPlaces} <span className="text-14r">платных мест</span></span>
                        <span className="text-14r">от <span className="text-14b">{formatPrice(data.bachelor.minPrice)}</span> ₽</span>
                    </div>

                    {/* Магистратура */}
                    <div className="faculty-card__stat-group">
                        <span className="faculty-card__stat-title text-14m">Магистратура</span>
                        <span className="text-14b">{data.master.directions} <span className="text-14r">направлений</span></span>
                        <span className="text-14b">{data.master.budgetPlaces} <span className="text-14r">бюджетных мест</span></span>
                        <span className="text-14b">{data.master.paidPlaces} <span className="text-14r">платных мест</span></span>
                        <span className="text-14r">от <span className="text-14b">{formatPrice(data.master.minPrice)}</span> ₽</span>
                    </div>
                </div>
            </div>

            {/* КНОПКА: Теперь она идет в самом конце */}
            <button className="btn btn--green faculty-card__btn">
                Подробнее
            </button>

        </div>
    );
}