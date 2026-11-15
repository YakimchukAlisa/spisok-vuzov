import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import FeedbackForm from './component/FeedbackForm';
import ProfessionCard from './component/ProfessionCard';

export default function DirectionPage() {
    const { directionId } = useParams();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/profil/${directionId}`)
            .then(res => {
                setProfile(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Ошибка загрузки профиля:", err);
                setIsLoading(false);
            });
    }, [directionId]);

    if (isLoading) return <div className="container" style={{ padding: '100px' }}>Загрузка...</div>;
    if (!profile) return <div className="container" style={{ padding: '100px' }}>Профиль не найден</div>;

    const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

    const formatSrokObuch = (months) => {
        if (!months || months <= 0) return '';
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        let result = '';
        if (years > 0) {
            const yearWord = years % 10 === 1 && years % 100 !== 11 ? 'год'
                           : [2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100) ? 'года'
                           : 'лет';
            result += `${years} ${yearWord}`;
        }
        if (remainingMonths > 0) {
            if (result) result += ' ';
            const monthWord = remainingMonths % 10 === 1 && remainingMonths % 100 !== 11 ? 'месяц'
                            : [2, 3, 4].includes(remainingMonths % 10) && ![12, 13, 14].includes(remainingMonths % 100) ? 'месяца'
                            : 'месяцев';
            result += `${remainingMonths} ${monthWord}`;
        }
        return result;
    };

    return (
        <div className="wrapper">
            <div className="containerDirection" style={{ paddingTop: '40px' }}>

                {/* ШАПКА НАПРАВЛЕНИЯ */}
                <div className="direction-header">
                    <div className="direction-header__logo">
                        {profile.fakultetLogo && (
                            <img
                                src={profile.fakultetLogo}
                                alt="Логотип"
                                className="direction-header__logo-img"
                            />
                        )}
                    </div>
                    <div className="direction-header__titles">
                        <h1 className="direction-header__title text-28sm">
                            {profile.name}
                        </h1>
                        <p className="direction-header__code text-20r" style={{ color: 'var(--black)', marginTop: '4px' }}>
                            {profile.kod} {profile.napravlenieName}
                        </p>
                        <p className="text-20r" style={{ color: 'var(--gray)', marginTop: '8px' }}>
                            {profile.vuzName} • {profile.fakultetName}
                        </p>
                    </div>
                </div>

                {/* ОПИСАНИЕ */}
                <div className="direction-description" style={{ marginTop: '24px' }}>
                    <p className="text-20r">{profile.opisanie}</p>
                </div>

                              {/* ФОРМЫ ОБУЧЕНИЯ И МЕСТА */}
                              <div className="direction-forms" style={{ marginTop: '40px' }}>
                                  <h2 className="text-28sm">Поступление</h2>

                                  <div className="direction-forms__list" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                      {profile.forms && profile.forms.map((form, idx) => (
                                          <div key={idx} className="direction-form-group">
                                              <h3 className="text-20r" style={{ color: 'var(--green)', marginBottom: '16px' }}>
                                                  {form.forma} форма обучения ({form.uroven}), {formatSrokObuch(form.srokObuchMes)}
                                              </h3>
                                              <div className="direction-forms__cards">
                                                  <div className="direction-form-card">
                                                      <div className="direction-form-card__number">1</div>
                                                      <div className="direction-form-card__info">
                                                          <h4 className="text-24b">Бюджет</h4>
                                                          <p className="text-20b">{form.budgetPlaces} мест</p>
                                                          <p className="text-20r">от {form.budgetMinScore} баллов</p>
                                                      </div>
                                                  </div>
                                                  <div className="direction-form-card">
                                                      <div className="direction-form-card__number">2</div>
                                                      <div className="direction-form-card__info">
                                                          <h4 className="text-24b">Платно</h4>
                                                          <p className="text-20b">{form.paidPlaces} мест</p>
                                                          <p className="text-20r">от {form.paidMinScore} баллов</p>
                                                          {form.paidMinPrice > 0 && (
                                                              <p className="text-20r">от {formatPrice(form.paidMinPrice)}</p>
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                {/* ФАЙЛЫ */}
                {profile.files && profile.files.length > 0 && (
                    <div className="direction-files" style={{ marginTop: '40px' }}>
                        <h2 className="text-28sm">Файлы</h2>
                        <div className="direction-files__list">
                            {profile.files.map((file, index) => (
                                <a
                                    key={index}
                                    href={`http://localhost:8080${file.url}`}
                                    download
                                    className="direction-file-card"
                                >
                                    <img
                                        src="/download.svg"
                                        alt="Скачать"
                                        className="direction-file-card__icon"
                                    />
                                    <span className="text-20r">{file.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* ПОДХОДЯЩИЕ ПРОФЕССИИ */}
                {profile.professions && profile.professions.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <h2 className="text-28sm" style={{ marginBottom: '20px' }}>Подходящие профессии</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {profile.professions.map(prof => (
                                <ProfessionCard key={prof.id} data={prof} type="profession" />
                            ))}
                        </div>
                    </div>
                )}

                {/* ПОХОЖИЕ СПЕЦИАЛЬНОСТИ */}
                {profile.similar && profile.similar.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <h2 className="text-28sm" style={{ marginBottom: '20px' }}>Похожие специальности</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {profile.similar.map(dir => (
                                <ProfessionCard key={dir.kod} data={dir} type="specialty" isGlobal={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* БЛОК С ВОПРОСАМИ */}
                <div className='direction-title-and-form' style={{ marginTop: '40px' }}>
                    <h2 className="text-28sm">Остались вопросы?</h2>
                    <div className='text-and-form'>
                        <h3 className="text-20r">Задайте вопрос в приёмную комиссию ВУЗа и сотрудник с радостью ответит Вам!</h3>
                        <FeedbackForm
                            vuzName={profile.vuzName}
                            vuzEmail="info@example.com"
                        />
                    </div>
                </div>

                {/* Кнопка назад */}
                <Link to={`/vuz/${profile.vuzId}/faculty/${profile.facultyId}`} className="btn btn--green" style={{ marginTop: '40px' }}>
                    Назад к факультету
                </Link>
            </div>
        </div>
    );
}