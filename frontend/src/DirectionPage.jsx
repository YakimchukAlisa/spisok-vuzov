import React from 'react';
import { useParams, Link } from 'react-router-dom';
import vuzData from './DATA/cardVuz.json';
import VuzDetailsHero from './component/VuzDetailsHero';
import FeedbackForm from './component/FeedbackForm';
import ProfessionsBlock from './component/ProfessionsBlock';
import SimilarDirections from './component/SimilarDirections';


export default function DirectionPage() {
    const { vuzId, facultyId, directionId } = useParams();

    const vuz = vuzData.find((v) => v.id === Number(vuzId));
    const faculty = vuz?.faculties?.find((f) => f.id === Number(facultyId));

    let direction = faculty?.bachelor?.directionsList?.find(d => d.id === Number(directionId));
    if (!direction) {
        direction = faculty?.master?.directionsList?.find(d => d.id === Number(directionId));
    }

    if (!direction) {
        return <div className="container">Направление не найдено</div>;
    }

    const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

    return (
        <div className="wrapper">
            <VuzDetailsHero data={vuz} />
            <div className="containerDirection">

                {/* ШАПКА НАПРАВЛЕНИЯ */}
                <div className="direction-header">
                    <div className="direction-header__logo">
                        {faculty.imageUrl && (
                            <img
                                src={faculty.imageUrl}
                                alt="Логотип"
                                className="direction-header__logo-img"
                            />
                        )}
                    </div>
                    <div className="direction-header__titles">
                        <h1 className="direction-header__title text-28sm">
                            {direction.name}
                        </h1>
                        <p className="direction-header__code text-20r" style={{ color: 'var(--black)', marginTop: '4px' }}>
                            {direction.code}
                        </p>
                    </div>
                </div>

                {/* ОПИСАНИЕ */}
                <div className="direction-description">
                    <h2 className="text-20b" style={{ color: 'var(--green)' }}>
                        Всего: {vuzData.length} ВУЗа
                    </h2>
                    <p className="text-20r" style={{ marginTop: '16px' }}>{direction.description}</p>
                </div>

                {/* КАКИЕ ПРЕДМЕТЫ СДАВАТЬ */}
                {direction.exams && direction.exams.length > 0 && (
                    <div className="direction-skills">
                        <h2 className="text-28sm">Какие предметы сдавать?</h2>
                        <div className="direction-skills__grid">
                            {direction.exams.map((exam, index) => (
                                <div key={index} className="direction-skill-card">
                                    <span className="direction-skill-card__number">{index + 1}</span>
                                    <span className="text-20r">{exam}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ФОРМЫ ОБУЧЕНИЯ */}
                <div className="direction-forms">
                    <h2 className="text-28sm">Формы обучения</h2>

                    <div className="direction-forms__list">
                        {/* Очная форма */}
                        <div className="direction-form-group">
                            <h3 className="text-20r" style={{ color: 'var(--green)' }}>
                                {direction.educationForms?.fullTime?.name}
                            </h3>
                            <div className="direction-forms__cards">
                                <div className="direction-form-card">
                                    <div className="direction-form-card__number">1</div>
                                    <div className="direction-form-card__info">
                                        <h4 className="text-24b">Бюджет</h4>
                                        <p className="text-20b">{direction.educationForms?.fullTime?.budget?.places} мест</p>
                                        <p className="text-20r">от {direction.educationForms?.fullTime?.budget?.minScore} баллов</p>
                                    </div>
                                </div>
                                <div className="direction-form-card">
                                    <div className="direction-form-card__number">2</div>
                                    <div className="direction-form-card__info">
                                        <h4 className="text-24b">Платно</h4>
                                        <p className="text-20b">{direction.educationForms?.fullTime?.paid?.places} мест</p>
                                        <p className="text-20r">от {direction.educationForms?.fullTime?.paid?.minScore} баллов</p>
                                        <p className="text-20r">от {direction.educationForms?.fullTime?.paid?.minPrice ? formatPrice(direction.educationForms.fullTime.paid.minPrice) : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Заочная форма (если есть) */}
                        {direction.educationForms?.partTime && (
                            <div className="direction-form-group">
                                <h3 className="text-20r" style={{ color: 'var(--green)' }}>
                                    {direction.educationForms.partTime.name}
                                </h3>
                                <div className="direction-forms__cards">
                                    <div className="direction-form-card">
                                        <div className="direction-form-card__number">1</div>
                                        <div className="direction-form-card__info">
                                            <h4 className="text-24b">Бюджет</h4>
                                            <p className="text-20b">{direction.educationForms.partTime.budget.places} мест</p>
                                            <p className="text-20r">от {direction.educationForms.partTime.budget.minScore} баллов</p>
                                        </div>
                                    </div>
                                    <div className="direction-form-card">
                                        <div className="direction-form-card__number">2</div>
                                        <div className="direction-form-card__info">
                                            <h4 className="text-24b">Платно</h4>
                                            <p className="text-20b">{direction.educationForms.partTime.paid.places} мест</p>
                                            <p className="text-20r">от {direction.educationForms.partTime.paid.minScore} баллов</p>
                                            <p className="text-20r">от {formatPrice(direction.educationForms.partTime.paid.minPrice)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ФАЙЛЫ */}
                {direction.files && direction.files.length > 0 && (
                    <div className="direction-files">
                        <h2 className="text-28sm">Файлы</h2>
                        <div className="direction-files__list">
                            {direction.files.map((file, index) => (
                                <a key={index} href={file.url} download className="direction-file-card">
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
                <div className='direction-title-and-form'>
                    <h2 className="text-28sm">Остались вопросы?</h2>
                    <div className='text-and-form'>
                        <h3 className="text-20r">Задайте вопрос в приёмную комиссию ВУЗа и сотрудник с радостью ответит Вам!</h3>
                        <FeedbackForm
                            vuzName={vuz.name}
                            vuzEmail={vuz.contacts?.email || 'info@example.com'}
                        />
                    </div>
                </div>
                <ProfessionsBlock sphereIds={direction.sphereIds} />
                <SimilarDirections
                    currentDirectionId={direction.id}
                    sphereIds={direction.sphereIds}
                />
            </div>
        </div>
    );
}