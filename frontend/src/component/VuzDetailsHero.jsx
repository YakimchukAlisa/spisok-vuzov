import React from 'react';

export default function VuzDetailsHero({ data }) {
  if (!data) return null;

  const formatPrice = (price) => {
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

            {/* Логотип (выводится только если есть в JSON) */}
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
              <p className="vuz-hero__address">{data.address}</p>
            </div>
          </div>

          {/* Соцсети и сайт (появляются только если есть ссылка) */}
          <div className="vuz-hero__socials">
            {data.socials?.website && data.logoUrl && (
              <a href={data.socials.website} target="_blank" rel="noreferrer" className="vuz-hero__social-btn" title="Сайт">
                <img src={data.logoUrl} alt="Сайт" />
              </a>
            )}
            {data.socials?.vk && (
              <a href={data.socials.vk} target="_blank" rel="noreferrer" className="vuz-hero__social-btn" title="ВКонтакте">
                <img src="/VK.svg" alt="VK" />
              </a>
            )}
            {data.socials?.telegram && (
              <a href={data.socials.telegram} target="_blank" rel="noreferrer" className="vuz-hero__social-btn" title="Telegram">
                <img src="/telegram.svg" alt="TG" />
              </a>
            )}
            {/* Если вы используете MAX вместо Дзена */}
            {data.socials?.max && (
              <a href={data.socials.max} target="_blank" rel="noreferrer" className="vuz-hero__social-btn" title="MAX">
                <img src="/max.svg" alt="MAX" />
              </a>
            )}
          </div>
        </div>

        {/* СТАТИСТИКА */}
        <div className="vuz-hero__stats">
          <div className="vuz-hero__stat-item">
            <span className="text-32b">39</span>
            <span className="vuz-hero__stat-label text-14r">программ</span>
          </div>
          <div className="vuz-hero__stat-item">
            <span className="text-32b">от {formatPrice(data.paid.minPrice)}</span>
            <span className="vuz-hero__stat-label text-20r">₽ в год</span>
          </div>
          <div className="vuz-hero__stat-item">
            <span className="text-32b">{data.budget.places}</span>
            <span className="vuz-hero__stat-label text-20r">бюджетных мест</span>
          </div>
          <div className="vuz-hero__stat-item">
            <span className="text-32b">{data.paid.places}</span>
            <span className="vuz-hero__stat-label text-20r">платных мест</span>
          </div>
        </div>

        {/* НИЗ: Удобства и контакты */}
        <div className="vuz-hero__bottom">

          {/* Удобства (перебираем массив features) */}
          <div className="vuz-hero__features">
            {data.features?.map((feature, index) => (
              <div key={index} className="vuz-hero__feature text-24b">
                <img src="/chek.svg" alt="галочка" style={{ width: '24px', height: '24px' }} /> {feature}
              </div>
            ))}
          </div>

          {/* Контакты (если есть, выводим) */}
          <div className="vuz-hero__contacts">
            {data.contacts?.phone && (
              <a href={`tel:${data.contacts.phone.replace(/[^\d+]/g, '')}`} className="vuz-hero__contact-btn text-20r">
                <img src="/phone.svg" alt="телефон" style={{ width: '20px', height: '20px' }} /> {data.contacts.phone}
              </a>
            )}
            {data.contacts?.email && (
              <a href={`mailto:${data.contacts.email}`} className="vuz-hero__contact-btn text-20r">
                <img src="/email.svg" alt="почта" style={{ width: '20px', height: '20px' }} /> {data.contacts.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}