import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import VuzDetailsHero from './component/VuzDetailsHero';
import FeedbackForm from './component/FeedbackForm';
import ProfessionsBlock from './component/ProfessionsBlock';
import SimilarDirections from './component/SimilarDirections';

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

    // Формируем объект для VuzDetailsHero, чтобы шапка отрисовалась (если нужно)
    const adaptedVuz = {
        name: profile.vuzName,
        id: profile.vuzId,
        // Добавьте другие поля, если VuzDetailsHero их требует (например, логотип)
    };

    return (
        <div className="wrapper">
            {/* Если нужна шапка вуза, можно передать данные, но лучше передать полный объект вуза */}
            {/* <VuzDetailsHero data={adaptedVuz} /> */}

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
                <div className="direction-description">
                    <h2 className="text-20b" style={{ color: 'var(--green)' }}>
                        {profile.forma} форма обучения ({profile.uroven})
                    </h2>
                    <p className="text-20r" style={{ marginTop: '16px' }}>{profile.opisanie}</p>
                    <p className="text-20r" style={{ marginTop: '8px', color: 'var(--gray)' }}>
                        Срок обучения: {profile.srokObuchMes} мес.
                    </p>
                </div>

                {/* ФОРМЫ ОБУЧЕНИЯ И МЕСТА */}
                <div className="direction-forms" style={{ marginTop: '40px' }}>
                    <h2 className="text-28sm">Поступление</h2>

                    <div className="direction-forms__list">
                        <div className="direction-form-group">
                            <div className="direction-forms__cards">
                                <div className="direction-form-card">
                                    <div className="direction-form-card__number">1</div>
                                    <div className="direction-form-card__info">
                                        <h4 className="text-24b">Бюджет</h4>
                                        <p className="text-20b">{profile.budgetPlaces} мест</p>
                                        <p className="text-20r">от {profile.budgetMinScore} баллов</p>
                                    </div>
                                </div>
                                <div className="direction-form-card">
                                    <div className="direction-form-card__number">2</div>
                                    <div className="direction-form-card__info">
                                        <h4 className="text-24b">Платно</h4>
                                        <p className="text-20b">{profile.paidPlaces} мест</p>
                                        <p className="text-20r">от {profile.paidMinScore} баллов</p>
                                        {profile.paidMinPrice > 0 && (
                                            <p className="text-20r">от {formatPrice(profile.paidMinPrice)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* БЛОК С ВОПРОСАМИ */}
                <div className='direction-title-and-form' style={{ marginTop: '40px' }}>
                    <h2 className="text-28sm">Остались вопросы?</h2>
                    <div className='text-and-form'>
                        <h3 className="text-20r">Задайте вопрос в приёмную комиссию ВУЗа и сотрудник с радостью ответит Вам!</h3>
                        <FeedbackForm
                            vuzName={profile.vuzName}
                            vuzEmail="info@example.com" // Лучше добавить email вуза в ответ бэкенда
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