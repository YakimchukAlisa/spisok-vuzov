import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import VuzDetailsHero from './component/VuzDetailsHero';
import FeedbackForm from './component/FeedbackForm';
import ProfessionCard from './component/ProfessionCard';

// Порядок вкладок по уровню — как в реальности
const LEVEL_ORDER = ['Бакалавриат', 'Специалитет', 'Магистратура', 'Аспирантура'];

export default function DirectionPage() {
    const { directionId } = useParams();
    const [profile, setProfile] = useState(null);
    const [vuz, setVuz] = useState(null);
    const [activeBlock, setActiveBlock] = useState('professions');
    const [activeSimilarLevel, setActiveSimilarLevel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setActiveBlock('professions');     // сброс вкладок при переходе на другой профиль
                setActiveSimilarLevel(null);

                const profileRes = await axios.get(`http://localhost:8080/api/profil/${directionId}`);
                setProfile(profileRes.data);

                if (profileRes.data.vuzId) {
                    const vuzRes = await axios.get(`http://localhost:8080/api/vuz/${profileRes.data.vuzId}`);
                    setVuz(vuzRes.data);
                }
            } catch (err) {
                console.error("Ошибка:", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (directionId) fetchData();
    }, [directionId]);

    if (isLoading) return <div className="container" style={{ padding: '100px' }}>Загрузка...</div>;
    if (!profile) return <div className="container" style={{ padding: '100px' }}>Профиль не найден</div>;

    const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

    // Красивое форматирование срока обучения
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

    const professions = Array.isArray(profile.professions) ? profile.professions : [];
    const similar = Array.isArray(profile.similar) ? profile.similar : [];

    const hasProfessions = professions.length > 0;
    const hasSimilar = similar.length > 0;

    // Уровни похожих специальностей (поле uroven может содержать несколько через запятую)
    const similarLevelSet = new Set();
    similar.forEach(n => {
        (n.uroven || '').split(',').forEach(s => {
            const t = s.trim();
            if (t) similarLevelSet.add(t);
        });
    });
    const similarLevels = LEVEL_ORDER.filter(l => similarLevelSet.has(l))
        .concat([...similarLevelSet].filter(l => !LEVEL_ORDER.includes(l)));

    // Выбранный уровень похожих: сохранённый, если ещё актуален, иначе первый доступный
    const selectedSimilarLevel = activeSimilarLevel && similarLevels.includes(activeSimilarLevel)
        ? activeSimilarLevel
        : similarLevels[0];

    // Похожие специальности выбранного уровня
    const filteredSimilar = similar.filter(n => (n.uroven || '').includes(selectedSimilarLevel));

    // Какой блок показывать: если есть оба — по вкладке, иначе единственный доступный
    const activeContent = hasProfessions && hasSimilar
        ? activeBlock
        : (hasProfessions ? 'professions' : 'similar');

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

    const tabButtonStyle = (isActive) => ({
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
        color: isActive ? 'var(--black)' : 'var(--gray)',
        borderBottom: isActive ? '3px solid var(--green)' : '3px solid transparent',
        transition: 'all 0.2s ease',
    });

    const levelTabButtonStyle = (isActive) => ({
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0 0 6px 0', fontSize: '18px', fontWeight: '700',
        color: isActive ? 'var(--green)' : 'var(--gray)',
        borderBottom: isActive ? '2px solid var(--green)' : '2px solid transparent',
        transition: 'all 0.2s ease',
    });

    return (
        <div className="wrapper">
            {adaptedVuz && <VuzDetailsHero data={adaptedVuz} />}

            <div className="containerDirection" style={{ paddingTop: '40px' }}>

                {/* ШАПКА ПРОФИЛЯ */}
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
                <div className="direction-description" style={{ marginTop: '24px' }}>
                    <p className="text-20r">{profile.opisanie}</p>
                </div>

                 {/* ПРЕДМЕТЫ ДЛЯ ПОСТУПЛЕНИЯ */}
                 {profile.exams && profile.exams.length > 0 && (() => {
                   // группируем по приоритету
                   const byPriority = profile.exams.reduce((acc, exam) => {
                     const p = exam.priority ?? 999;
                     (acc[p] = acc[p] || []).push(exam);
                     return acc;
                   }, {});

                   // каждый приоритет — одна строка, предметы внутри — отдельные карточки
                   const items = Object.keys(byPriority)
                     .map(Number)
                     .sort((a, b) => a - b)
                     .map(priority => ({
                       priority: priority >= 999 ? null : priority,
                       subjects: byPriority[priority].map(e => ({
                         name: e.name,
                         minball: e.minball || 0,
                       })),
                     }));

                   return (
                     <div className="direction-skills" style={{ marginTop: '40px' }}>
                       <h2 className="text-28sm">Какие предметы сдавать?</h2>

                       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                         {items.map((item, idx) => (
                           <div
                             key={idx}
                             style={{
                               display: 'grid',
                               gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                               gap: '12px',
                             }}
                           >
                             {item.subjects.map((s, i) => (
                               <div key={i} className="direction-skill-card">
                                 <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                   <span className="direction-skill-card__number">
                                     {item.priority ?? '—'}
                                   </span>

                                   <div style={{ flex: 1 }}>
                                     <div className="text-20r" style={{ marginTop: '2px' }}>
                                       {s.name}
                                     </div>

                                     {s.minball > 0 && (
                                       <div
                                         className="text-14r"
                                         style={{ color: 'var(--green)', marginTop: 'auto', paddingTop: '8px' }}
                                       >
                                         от {s.minball} баллов
                                       </div>
                                     )}
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                         ))}
                       </div>
                     </div>
                   );
                 })()}



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
                                    {/* Бюджет */}
                                    <div className="direction-form-card">
                                        <div className="direction-form-card__number">1</div>
                                        <div className="direction-form-card__info">
                                            <h4 className="text-24b">Бюджет</h4>
                                            <p className="text-20b">
                                                {form.budgetPlaces > 0 ? `${form.budgetPlaces} мест` : '— мест'}
                                            </p>
                                            <p className="text-20r">
                                                {form.budgetMinScore > 0 ? `от ${form.budgetMinScore} баллов` : '— баллов'}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Платно */}
                                    <div className="direction-form-card">
                                        <div className="direction-form-card__number">2</div>
                                        <div className="direction-form-card__info">
                                            <h4 className="text-24b">Платно</h4>
                                            <p className="text-20b">
                                                {form.paidPlaces > 0 ? `${form.paidPlaces} мест` : '— мест'}
                                            </p>
                                            <p className="text-20r">
                                                {form.paidMinScore > 0 ? `от ${form.paidMinScore} баллов` : '— баллов'}
                                            </p>
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
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="direction-file-card"
                                >
                                    <img src="/download.svg" alt="Скачать" className="direction-file-card__icon" />
                                    <span className="text-20r">{file.name}</span>
                                </a>
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
                            vuzEmail={vuz?.email}
                        />
                    </div>
                </div>

  {/* ПОДХОДЯЩИЕ ПРОФЕССИИ */}
                {hasProfessions && (
                    <div style={{ marginTop: '48px' }}>
                        <h2 className="text-28sm" style={{ marginBottom: '24px' }}>Подходящие профессии</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {professions.map(p => (
                                <ProfessionCard
                                    key={p.id}
                                    data={p}
                                    type="profession"
                                    isGlobal={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ПОХОЖИЕ СПЕЦИАЛЬНОСТИ (с вкладками по уровню) */}
                {hasSimilar && (
                    <div style={{ marginTop: '48px' }}>
                        <h2 className="text-28sm" style={{ marginBottom: '24px' }}>Похожие специальности</h2>

                        {similarLevels.length > 1 && (
                            <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
                                {similarLevels.map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setActiveSimilarLevel(level)}
                                        style={levelTabButtonStyle(level === selectedSimilarLevel)}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>

                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {filteredSimilar.length > 0 ? (
                                filteredSimilar.map(n => (
                                    <ProfessionCard
                                        key={n.kod || n.id}
                                        data={n}
                                        type="specialty"
                                        isGlobal={true}
                                    />
                                ))
                            ) : (
                                <p className="text-14r" style={{ color: 'var(--gray)' }}>
                                    Для уровня «{selectedSimilarLevel}» похожих специальностей не нашлось.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Кнопка назад */}
                <Link to={`/vuz/${profile.vuzId}/faculty/${profile.facultyId}`} className="btn btn--green" style={{ marginTop: '40px', display: 'inline-block' }}>
                    Назад к факультету
                </Link>
            </div>
        </div>
    );
}
