import React from 'react';

export default function FacultyCard({ data }) {
    if (!data) return null;

    // Защита от падения (если бэкенд ещё не отдал статистику)
    const bachelor = data.bachelor || { directions: 0, budgetPlaces: 0, paidPlaces: 0, minPrice: 0 };
    const master = data.master || { directions: 0, budgetPlaces: 0, paidPlaces: 0, minPrice: 0 };

    // Берем названия и логотип (поддерживаем и старые, и новые поля на всякий случай)
    const name = data.shortName || data.name || 'Без названия';
    const logo = data.imageUrl || data.logoUrl;
    const description = data.fullName || data.description || 'Описание пока отсутствует.';

    const formatPrice = (price) => {
        if (!price) return '0';
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    return (
        <div className="faculty-card">

            {/* ЛЕВАЯ ЧАСТЬ: Информация */}
            <div className="faculty-card__main">

                {/* Шапка факультета */}
                <div className="faculty-card__header">
                    {logo && (
                        <img src={logo} alt={name} className="faculty-card__logo" />
                    )}
                    <div className="faculty-card__title-block">
                        {/* Используем name вместо shortName */}
                        <h3 className="faculty-card__short-name">{name}</h3>
                    </div>
                </div>

                {/* ОПИСАНИЕ ВМЕСТО WORKPLACES */}
              <div className="faculty-card__work">
                  <span className="faculty-card__work-title">Где работать?</span>
                  <p className="text-14r" style={{ marginTop: '8px' }}>
                      {description}
                  </p>
              </div>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Статистика */}
            <div className="faculty-card__stats-wrapper">
                <div className="faculty-card__divider"></div>
                <div className="faculty-card__stats">
                    {/* Бакалавриат */}
                    <div className="faculty-card__stat-group">
                        <span className="faculty-card__stat-title text-14m">Бакалавриат</span>
                        <span className="text-14b">{bachelor.directions} <span className="text-14r">направлений</span></span>
                        <span className="text-14b">{bachelor.budgetPlaces} <span className="text-14r">бюджетных мест</span></span>
                        <span className="text-14b">{bachelor.paidPlaces} <span className="text-14r">платных мест</span></span>
                        <span className="text-14r">от <span className="text-14b">{formatPrice(bachelor.minPrice)}</span> ₽</span>
                    </div>

                    {/* Магистратура */}
                    <div className="faculty-card__stat-group">
                        <span className="faculty-card__stat-title text-14m">Магистратура</span>
                        <span className="text-14b">{master.directions} <span className="text-14r">направлений</span></span>
                        <span className="text-14b">{master.budgetPlaces} <span className="text-14r">бюджетных мест</span></span>
                        <span className="text-14b">{master.paidPlaces} <span className="text-14r">платных мест</span></span>
                        <span className="text-14r">от <span className="text-14b">{formatPrice(master.minPrice)}</span> ₽</span>
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