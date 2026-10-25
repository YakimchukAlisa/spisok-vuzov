import React from 'react';

export default function VuzDetailsHero({ data, features = [] }) {
  if (!data) return null;

  const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <section className="vuz-hero">
      {/* Фон */}
      <div className="vuz-hero__bg" style={{ backgroundImage: `url(${data.imageUrl})` }}>
        <div className="vuz-hero__overlay"></div>
      </div>

      <div className="vuz-hero__container">
        {/* ВЕРХ: Название, адрес, соцсети */}
        <div className="vuz-hero__top">
          <div className="vuz-hero__title-block">
            {data.logoUrl && (
              <div className="vuz-hero__logo">
                <img
                  src={data.logoUrl}
                  alt={`Логотип ${data.name}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            )}

            <div className="vuz-hero__text">
              <h1 className="vuz-hero__name">{data.name}</h1>
              <p className="vuz-hero__address">{data.adress || 'Адрес не указан'}</p>
            </div>
          </div>

          {/* Соцсети и сайт (берем из плоских полей API) */}
          <div className="vuz-hero__socials">
            {data.site && (
              <a href={data.site} target="_blank" rel="noreferrer" className="vuz-hero__social-btn" title="Сайт">
                <img src={data.logoUrl} alt="Сайт" />
              </a>
            )}
            {data.vkUrl && (
              <a href={data.vkUrl} target="_blank" rel="noreferrer" className="vuz-hero__social-btn" title="ВКонтакте">
                <img src="/VK.svg" alt="VK" />
              </a>
            )}
            {data.telegramUrl && (
              <a href={data.telegramUrl} target="_blank" rel="noreferrer" className="vuz-hero__social-btn" title="Telegram">
                <img src="/telegram.svg" alt="TG" />
              </a>
            )}
            {data.maxUrl && (
              <a href={data.maxUrl} target="_blank" rel="noreferrer" className="vuz-hero__social-btn" title="MAX">
                <img src="/max.svg" alt="MAX" />
              </a>
            )}
          </div>
        </div>

        {/* СТАТИСТИКА */}
        <div className="vuz-hero__stats">
          <div className="vuz-hero__stat-item">
            <span className="text-32b">{data.budgetPlaces || 0}</span>
            <span className="vuz-hero__stat-label text-20r">бюджетных мест</span>
          </div>
          <div className="vuz-hero__stat-item">
            <span className="text-32b">{data.paidPlaces || 0}</span>
            <span className="vuz-hero__stat-label text-20r">платных мест</span>
          </div>
          <div className="vuz-hero__stat-item">
            <span className="text-32b">от {formatPrice(data.paidMinPrice)}</span>
            <span className="vuz-hero__stat-label text-20r">₽ в год</span>
          </div>
        </div>

        {/* НИЗ: Удобства и контакты */}
        <div className="vuz-hero__bottom">
          {/* Удобства (возможности) */}
          <div className="vuz-hero__features">
            {features.map((feature, index) => (
              <div key={index} className="vuz-hero__feature text-24b">
                <img src="/chek.svg" alt="галочка" style={{ width: '24px', height: '24px' }} /> {feature}
              </div>
            ))}
          </div>

          {/* Контакты (берем из плоских полей API) */}
          <div className="vuz-hero__contacts">
            {data.phone && (
              <a href={`tel:${data.phone.replace(/[^\d+]/g, '')}`} className="vuz-hero__contact-btn text-20r">
                <img src="/phone.svg" alt="телефон" style={{ width: '20px', height: '20px' }} /> {data.phone}
              </a>
            )}
            {data.email && (
              <a href={`mailto:${data.email}`} className="vuz-hero__contact-btn text-20r">
                <img src="/email.svg" alt="почта" style={{ width: '20px', height: '20px' }} /> {data.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}