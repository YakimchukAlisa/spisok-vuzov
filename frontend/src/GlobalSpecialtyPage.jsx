import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VuzCard from './component/VuzCard';
import ProfessionCard from './component/ProfessionCard';
import CareerTestBlock from './component/CareerTestBlock';
import './css/globalSpecialtyPage.css';

export default function GlobalSpecialtyPage() {
    const { kod } = useParams();

    const [specialty, setSpecialty] = useState(null);
    const [vuzes, setVuzes] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [professions, setProfessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchVuz, setSearchVuz] = useState('');
    const [searchProf, setSearchProf] = useState('');
    const [searchSpec, setSearchSpec] = useState('');

       useEffect(() => {
           const fetchData = async () => {
               try {
                   setIsLoading(true);

                   const [specRes, similarRes, professionsRes] = await Promise.all([
                       axios.get(`http://localhost:8080/api/napravlenie/${kod}`),
                       axios.get(`http://localhost:8080/api/napravlenie/${kod}/similar`),
                       axios.get(`http://localhost:8080/api/napravlenie/${kod}/professions`)
                   ]);

                   setSpecialty(specRes.data);
                   setVuzes(specRes.data.vuzes || []);
                   setSimilar(similarRes.data || []);
                   setProfessions(professionsRes.data || []);

               } catch (err) {
                   console.error("Ошибка при загрузке данных:", err);
               } finally {
                   setIsLoading(false);
               }
           };
           fetchData();
        }, [kod]);
    if (isLoading) return <div className="container" style={{ padding: '100px' }}>Загрузка...</div>;
    if (!specialty) return <div className="container" style={{ padding: '100px' }}>Специальность не найдена</div>;

    // Фильтрация
    const filteredVuzes = vuzes.filter(v => v.name.toLowerCase().includes(searchVuz.toLowerCase()));
    const filteredSimilar = similar.filter(s => s.name.toLowerCase().includes(searchSpec.toLowerCase()));
    const filteredProfessions = professions.filter(p => p.name.toLowerCase().includes(searchProf.toLowerCase()));

    return (
        <div className="wrapper">
            <div className="container" style={{ marginTop: '100px' }}>

                {/* ШАПКА */}
                <div className="global-specialty-header" style={{padding: '0px 20px'}}>
                    <h1 className="text-32b">{specialty.name}</h1>
                    <p className="text-20b" style={{ color: 'var(--green)' }}>
                        {specialty.kod}
                    </p>
                    {specialty.opisanie && <p className="text-20r" style={{ marginTop: '16px' }}>{specialty.opisanie}</p>}
                </div>

                                {/* КАКИЕ ПРЕДМЕТЫ СДАВАТЬ */}
                                {specialty.exams && specialty.exams.length > 0 && (
                                    <div className="global-specialty-exams" style={{ padding: '0px 20px', marginTop: '40px' }}>
                                        <h2 className="text-28sm" style={{ marginBottom: '24px' }}>Какие предметы сдавать?</h2>
                                        <div className="direction-skills__grid">
                                            {specialty.exams.map((exam, index) => (
                                                <div key={indsex} className="direction-skill-card">
                                                    <span className="direction-skill-card__number">{index + 1}</span>
                                                    <span className="text-20r">{exam}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                {/* СПИСОК ВУЗОВ */}
                <div className="global-specialty-vuzes" style={{padding: '0px 20px', marginTop: '40px'}}>
                    <h2 className="text-28sm" style={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
                        Где учиться?
                        <span style={{ color: 'var(--gray)', fontWeight: '400', fontSize: '20px' }}>
                            ({filteredVuzes.length} {filteredVuzes.length === 1 ? 'Вуз' : 'Вуза'})
                        </span>
                    </h2>

                    <div className="field" style={{ marginBottom: '24px' }}>
                        <input type="text" className="field__input" placeholder=" " value={searchVuz} onChange={(e) => setSearchVuz(e.target.value)} />
                        <label className="field__label">Поиск вуза...</label>
                        <img src="/search.svg" alt="Поиск" className="field__icon" />
                    </div>

                    <div className="vuz-list">
                        {filteredVuzes.length > 0 ? (
                            filteredVuzes.map((vuz) => (
                                <VuzCard key={vuz.id} data={vuz} />
                            ))
                        ) : (
                            <p className="text-20r" style={{ color: 'var(--gray)' }}>Вузы не найдены</p>
                        )}
                    </div>
                </div>

                {/* ПОДХОДЯЩИЕ ПРОФЕССИИ */}
                {professions.length > 0 && (
                    <div className="global-specialty-professions" style={{padding: '0px 20px', marginTop: '40px'}}>
                        <h2 className="text-32b" style={{ marginBottom: '20px' }}>Подходящие профессии</h2>

                        <div className="field" style={{ marginBottom: '24px'}}>
                            <input type="text" className="field__input" placeholder=" " value={searchProf} onChange={(e) => setSearchProf(e.target.value)} />
                            <label className="field__label">Поиск профессии...</label>
                            <img src="/search.svg" alt="Поиск" className="field__icon" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {filteredProfessions.map((prof) => (
                                <ProfessionCard key={prof.id} data={prof} type="profession" />
                            ))}
                        </div>
                    </div>
                )}

                {/* ПОХОЖИЕ СПЕЦИАЛЬНОСТИ */}
                {similar.length > 0 && (
                    <div className="similar-directions" style={{padding: '0px 20px', marginTop: '40px'}}>
                        <h2 className="text-32b" style={{ marginBottom: '20px' }}>Похожие специальности</h2>

                        <div className="field" style={{ marginBottom: '24px'}}>
                            <input type="text" className="field__input" placeholder=" " value={searchSpec} onChange={(e) => setSearchSpec(e.target.value)} />
                            <label className="field__label">Поиск специальности...</label>
                            <img src="/search.svg" alt="Поиск" className="field__icon" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {filteredSimilar.map((dir) => (
                                <ProfessionCard
                                    key={dir.kod}
                                    data={dir}
                                    type="specialty"
                                    isGlobal={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <CareerTestBlock />
            </div>
        </div>
    );
}