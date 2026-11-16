import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import professionsData from './DATA/professions.json';
import vuzData from './DATA/cardVuz.json';
import spheresData from './DATA/spheres.json';
import VuzCard from './component/VuzCard';
import CareerTestBlock from './component/CareerTestBlock';
import './css/globalSpecialtyPage.css';
import ProfessionCard from './component/ProfessionCard';

export default function GlobalSpecialtyPage() {
    const { id } = useParams();
    
    const [searchVuz, setSearchVuz] = useState('');
    const [searchProf, setSearchProf] = useState('');
    const [searchSpec, setSearchSpec] = useState('');

    // 1. Ищем специальность, вузы и похожие специальности
    const { specialty, vuzes, similarSpecialties } = useMemo(() => {
        let foundSpecialty = null;
        let vuzesWithSpecialty = [];
        let allSimilar = [];
        const uniqueVuzes = new Set();
        const uniqueSpecialties = new Set();

        vuzData.forEach(vuz => {
            vuz.faculties?.forEach(faculty => {
                const allDirs = [
                    ...(faculty.bachelor?.directionsList || []),
                    ...(faculty.master?.directionsList || [])
                ];
                allDirs.forEach(dir => {
                    if (dir.id === Number(id) && !foundSpecialty) {
                        foundSpecialty = dir;
                    }
                });
            });
        });

        if (!foundSpecialty) return { specialty: null, vuzes: [], similarSpecialties: [] };

        const currentSphereId = foundSpecialty.sphereIds ? foundSpecialty.sphereIds[0] : null;

        vuzData.forEach(vuz => {
            vuz.faculties?.forEach(faculty => {
                const allDirs = [
                    ...(faculty.bachelor?.directionsList || []),
                    ...(faculty.master?.directionsList || [])
                ];

                allDirs.forEach(dir => {
                    // 1. Вузы для этой специальности (по коду)
                    if (dir.code === foundSpecialty.code) {
                        if (!uniqueVuzes.has(vuz.id)) {
                            uniqueVuzes.add(vuz.id);
                            vuzesWithSpecialty.push(vuz);
                        }
                    }

                    // 2. Похожие специальности (по сфере, но другой код)
                    const dirSphereId = dir.sphereIds ? dir.sphereIds[0] : null;
                    if (dirSphereId === currentSphereId && dir.code !== foundSpecialty.code) {
                        if (!uniqueSpecialties.has(dir.code)) {
                            uniqueSpecialties.add(dir.code);
                            
                            // 👇 СЧИТАЕМ КОЛИЧЕСТВО ВУЗОВ ДЛЯ ЭТОЙ СПЕЦИАЛЬНОСТИ
                            const vuzesForThisSpec = new Set();
                            vuzData.forEach(v => {
                                v.faculties?.forEach(f => {
                                    const fDirs = [
                                        ...(f.bachelor?.directionsList || []),
                                        ...(f.master?.directionsList || [])
                                    ];
                                    if (fDirs.some(d => d.code === dir.code)) {
                                        vuzesForThisSpec.add(v.id);
                                    }
                                });
                            });

                            allSimilar.push({
                                ...dir,
                                vuzId: vuz.id,
                                facultyId: faculty.id,
                                vuzCount: vuzesForThisSpec.size // <--- СОХРАНЯЕМ
                            });
                        }
                    }
                });
            });
        });

        return { specialty: foundSpecialty, vuzes: vuzesWithSpecialty, similarSpecialties: allSimilar };
    }, [id]);

    if (!specialty) {
        return <div className="container" style={{ padding: '100px 20px' }}>Специальность не найдена</div>;
    }

    const sphereId = specialty.sphereIds ? specialty.sphereIds[0] : null;
    const relatedProfessions = professionsData.filter(p => p.sphereId === sphereId);

    // ==========================================
    // ФИЛЬТРАЦИЯ ДЛЯ ТРЕХ ПОИСКОВ
    // ==========================================
    const filteredVuzes = vuzes.filter(vuz => 
        vuz.name.toLowerCase().includes(searchVuz.toLowerCase())
    );

    const filteredProfessions = relatedProfessions.filter(prof => 
        prof.name.toLowerCase().includes(searchProf.toLowerCase())
    );

    const filteredSimilarSpecialties = similarSpecialties.filter(dir => 
        dir.name.toLowerCase().includes(searchSpec.toLowerCase()) || 
        (dir.code_name && dir.code_name.toLowerCase().includes(searchSpec.toLowerCase()))
    );

    return (
        <div className="wrapper">
            <div className="container" style={{ marginTop: '100px' }}>
                
                {/* ШАПКА СПЕЦИАЛЬНОСТИ */}
                <div className="global-specialty-header" style={{padding: '0px 20px'}}>
                    <h1 className="text-32b">{specialty.name}</h1>
                    <p className="text-20b" style={{ color: 'var(--green)' }}>
                        {specialty.code} {specialty.code_name}
                    </p>
                    <p className="text-20r">{specialty.description}</p>
                </div>

                {/* КАКИЕ ПРЕДМЕТЫ СДАВАТЬ */}
                {specialty.exams && specialty.exams.length > 0 && (
                    <div className="global-specialty-exams" style={{ padding: '0px 20px' }}>
                        <h2 className="text-28sm" style={{ marginBottom: '24px' }}>Какие предметы сдавать?</h2>
                        <div className="direction-skills__grid">
                            {specialty.exams.map((exam, index) => (
                                <div key={index} className="direction-skill-card">
                                    <span className="direction-skill-card__number">{index + 1}</span>
                                    <span className="text-20r">{exam}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* СПИСОК ВУЗОВ С ПОИСКОМ */}
                <div className="global-specialty-vuzes" style={{padding: '0px 20px'}}>
                    <h2 className="text-28sm" style={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
                        Где учиться?
                        <span style={{ color: 'var(--gray)', fontWeight: '400', fontSize: '20px' }}>
                            ({filteredVuzes.length} {filteredVuzes.length === 1 ? 'Вуз' : 'Вуза'})
                        </span>
                    </h2>

                    {/* Поиск по вузам */}
                    <div className="field">
                        <input
                            type="text"
                            className="field__input"
                            placeholder=" "
                            value={searchVuz}
                            onChange={(e) => setSearchVuz(e.target.value)}
                        />
                        <label className="field__label">Поиск вуза...</label>
                        <img src="/search.svg" alt="Поиск" className="field__icon" />
                    </div>

                    <div className="vuz-list" style={{padding: '0px 0px', marginTop: '0px', marginBottom: '0px'}}>
                        {filteredVuzes.length > 0 ? (
                            filteredVuzes.map((vuz) => (
                                <VuzCard key={vuz.id} data={vuz} />
                            ))
                        ) : (
                            <p className="text-20r" style={{ color: 'var(--gray)' }}>Вузы не найдены</p>
                        )}
                    </div>
                </div>

                {/* ПОДХОДЯЩИЕ ПРОФЕССИИ С ПОИСКОМ */}
                {relatedProfessions.length > 0 && (
                    <div className="global-specialty-professions" style={{padding: '0px 20px'}}>
                        <h2 className="text-32b" style={{ marginBottom: '20px' }}>Подходящие профессии</h2>
                        
                        {/* Поиск по профессиям */}
                        <div className="field" style={{ marginBottom: '24px'}}>
                            <input
                                type="text"
                                className="field__input"
                                placeholder=" "
                                value={searchProf}
                                onChange={(e) => setSearchProf(e.target.value)}
                            />
                            <label className="field__label">Поиск профессии...</label>
                            <img src="/search.svg" alt="Поиск" className="field__icon" />
                        </div>

                        <div className="professions-block__list">
                            {filteredProfessions.length > 0 ? (
                                filteredProfessions.slice(0, 4).map((prof) => (
                                    <ProfessionCard key={prof.id} data={prof} type="profession" />
                                ))
                            ) : (
                                <p className="text-20r" style={{ color: 'var(--gray)' }}>Профессии не найдены</p>
                            )}
                        </div>
                    </div>
                )}

                {/* ПОХОЖИЕ СПЕЦИАЛЬНОСТИ С ПОИСКОМ */}
                {similarSpecialties.length > 0 && (
                    <div className="similar-directions" style={{padding: '0px 20px'}}>
                        <h2 className="text-32b" style={{ marginBottom: '20px' }}>Похожие специальности</h2>
                        
                        {/* Поиск по специальностям */}
                        <div className="field" style={{ marginBottom: '24px'}}>
                            <input
                                type="text"
                                className="field__input"
                                placeholder=" "
                                value={searchSpec}
                                onChange={(e) => setSearchSpec(e.target.value)}
                            />
                            <label className="field__label">Поиск специальности...</label>
                            <img src="/search.svg" alt="Поиск" className="field__icon" />
                        </div>

                        <div className="professions-block__list">
                            {filteredSimilarSpecialties.length > 0 ? (
                                filteredSimilarSpecialties.slice(0, 4).map((dir, index) => (
                                    <div key={index} className="profession-card">
                                        
                                        <div className="profession-card__top">
                                            <div className="profession-card__title-row">
                                                <h3 className="profession-card__title">{dir.name}</h3>
                                                <span className="profession-card__sphere">{dir.code} {dir.code_name}</span>
                                            </div>
                                            
                                            {/* 👇 ВЫВОДИМ СТАТИСТИКУ */}
                                            <div className="profession-card__stats">
                                                <span className="profession-card__stat-link">
                                                    {dir.vuzCount || 0} {dir.vuzCount === 1 ? 'Вуз' : 'Вуза(ов)'}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="profession-card__description">{dir.description}</p>
                                        <Link to={`/specialty/${dir.id}`} className="btn btn--green profession-card__btn">
                                            Подробнее
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-20r" style={{ color: 'var(--gray)' }}>Специальности не найдены</p>
                            )}
                        </div>
                    </div>
                )}

                {/* БЛОК С ТЕСТОМ НА ПРОФОРИЕНТАЦИЮ */}
                <CareerTestBlock />

            </div>
        </div>
    );
}