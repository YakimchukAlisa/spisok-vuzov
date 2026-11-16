import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import VuzDetailsHero from './component/VuzDetailsHero';
import FeedbackForm from './component/FeedbackForm';
import ProfessionsBlock from './component/ProfessionsBlock';
import SimilarDirections from './component/SimilarDirections';
import ProfessionCard from './component/ProfessionCard'; // Для похожих направлений

export default function DirectionPage() {
    const { vuzId, facultyId, directionId } = useParams();
    
    const [profile, setProfile] = useState(null);
    const [vuz, setVuz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Загружаем профиль (направление) с бекенда
                const profileRes = await axios.get(`http://localhost:8080/api/profil/${directionId}`);
                setProfile(profileRes.data);

                // 2. Загружаем данные вуза (для шапки)
                if (profileRes.data.vuzId) {
                    const vuzRes = await axios.get(`http://localhost:8080/api/vuz/${profileRes.data.vuzId}`);
                    setVuz(vuzRes.data);
                }
            } catch (err) {
                console.error("Ошибка загрузки данных:", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (directionId) fetchData();
    }, [directionId]);

    if (isLoading) return <div className="container" style={{ padding: '100px' }}>Загрузка...</div>;
    if (!profile) return <div className="container" style={{ padding: '100px' }}>Направление не найдено</div>;

    // Форматирование цены
    const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

    // Красивое форматирование срока обучения (года и месяцы)
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

    // Адаптируем вуз для шапки
    const adaptedVuz = vuz ? {
        id: vuz.id,
        name: vuz.name,
        fullName: vuz.abbreviatura,
        address: vuz.adress || 'Адрес не указан',
        imageUrl: vuz.imageUrl || '/img/default.jpg',
        logoUrl: vuz.logoUrl,
        totalPrograms: vuz.totalPrograms || 0,
        budget: { places: vuz.budgetPlaces || 0, minScore: vuz.budgetMinScore || 0 },
        paid: { places: vuz.paidPlaces || 0, minScore: vuz.paidMinScore || 0, minPrice: vuz.paidMinPrice || 0 },
        contacts: { phone: vuz.phone, email: vuz.email },
        socials: { website: vuz.site, vk: vuz.vkUrl, telegram: vuz.telegramUrl, max: vuz.maxUrl }
    } : null;

    return (
        <div className="wrapper">
            {/* ШАПКА ВУЗА */}
            {adaptedVuz && <VuzDetailsHero data={adaptedVuz} />}
            
            <div className="containerDirection">

                {/* ШАПКА НАПРАВЛЕНИЯ */}
                <div className="direction-header">
                    <div className="direction-header__logo">
                        {profile.fakultetLogo && (
                            <img src={profile.fakultetLogo} alt="Логотип" className="direction-header__logo-img" />
                        )}
                    </div>
                    <div className="direction-header__titles">
                        <h1 className="direction-header__title text-28sm">
                            {profile.name}
                        </h1>
                        <p className="direction-header__code text-20r" style={{ color: 'var(--black)', marginTop: '4px' }}>
                            {profile.kod} {profile.napravlenieName}
                        </p>
                    </div>
                </div>

                {/* ОПИСАНИЕ */}
                <div className="direction-description">
                    <h2 className="text-20b" style={{ color: 'var(--green)' }}>
                        Всего: {adaptedVuz?.totalPrograms || 1} ВУЗ(а)
                    </h2>
                    <p className="text-20r" style={{ marginTop: '16px' }}>{profile.opisanie}</p>
                </div>

                {/* КАКИЕ ПРЕДМЕТЫ СДАВАТЬ */}
                {profile.exams && profile.exams.length > 0 && (
                    <div className="direction-skills">
                        <h2 className="text-28sm">Какие предметы сдавать?</h2>
                        <div className="direction-skills__grid">
                            {profile.exams.map((exam, index) => (
                                <div key={index} className="direction-skill-card">
                                    <span className="direction-skill-card__number">{index + 1}</span>
                                    <span className="text-20r" style={{
                                        textDecoration: exam.isMandatory ? 'underline' : 'none',
                                        textDecorationColor: 'var(--green)',
                                        textDecorationThickness: '2px',
                                        textUnderlineOffset: '4px'
                                    }}>
                                        {exam.name}
                                        {!exam.isEge && (
                                            <span className="text-14r" style={{ color: 'var(--gray)', marginLeft: '8px', textDecoration: 'none' }}>
                                                (Внутренний)
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-14r" style={{ color: 'var(--gray)', marginTop: '16px' }}>
                           Подчеркнутые предметы обязательны.
                        </p>
                    </div>
                )}

                {/* ФОРМЫ ОБУЧЕНИЯ */}
                {profile.forms && profile.forms.length > 0 && (
                    <div className="direction-forms">
                        <h2 className="text-28sm">Формы обучения</h2>

                        <div className="direction-forms__list" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {profile.forms.map((form, idx) => (
                                <div key={idx} className="direction-form-group">
                                    <h3 className="text-20r" style={{ color: 'var(--green)' }}>
                                        {form.forma} форма обучения ({form.uroven}), {formatSrokObuch(form.srokObuchMes)}
                                    </h3>
                                    <div className="direction-forms__cards">
                                        
                                        {/* Бюджет */}
                                        <div className="direction-form-card">
                                            <div className="direction-form-card__number">1</div>
                                            <div className="direction-form-card__info">
                                                <h4 className="text-24b">Бюджет</h4>
                                                <p className="text-20b">{form.budgetPlaces > 0 ? `${form.budgetPlaces} мест` : '— мест'}</p>
                                                <p className="text-20r">{form.budgetMinScore > 0 ? `от ${form.budgetMinScore} баллов` : '— баллов'}</p>
                                            </div>
                                        </div>

                                        {/* Платно */}
                                        <div className="direction-form-card">
                                            <div className="direction-form-card__number">2</div>
                                            <div className="direction-form-card__info">
                                                <h4 className="text-24b">Платно</h4>
                                                <p className="text-20b">{form.paidPlaces > 0 ? `${form.paidPlaces} мест` : '— мест'}</p>
                                                <p className="text-20r">{form.paidMinScore > 0 ? `от ${form.paidMinScore} баллов` : '— баллов'}</p>
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
                )}

                {/* ФАЙЛЫ */}
                {profile.files && profile.files.length > 0 && (
                    <div className="direction-files">
                        <h2 className="text-28sm">Файлы</h2>
                        <div className="direction-files__list">
                            {profile.files.map((file, index) => (
                                <a key={index} href={`http://localhost:8080${file.url}`} download className="direction-file-card">
                                    <img src="/download.svg" alt="Скачать" className="direction-file-card__icon" />
                                    <span className="text-20r">{file.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div className='direction-title-and-form'>
                    <h2 className="text-28sm">Остались вопросы?</h2>
                    <div className='text-and-form'>
                        <h3 className="text-20r">Задайте вопрос в приёмную комиссию ВУЗа и сотрудник с радостью ответит Вам!</h3>
                        <FeedbackForm
                            vuzName={adaptedVuz?.name || 'Вуз'}
                            vuzEmail={adaptedVuz?.contacts?.email || 'info@example.com'}
                        />
                    </div>
                </div>

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
                
                {/* КНОПКА НАЗАД */}
                <Link
                    to={`/vuz/${profile.vuzId || vuzId}/faculty/${profile.facultyId || facultyId}`}
                    className="btn btn--green"
                    style={{ marginTop: '40px', display: 'inline-block' }}
                >
                    Назад к факультету
                </Link>

            </div>
        </div>
    );
}
