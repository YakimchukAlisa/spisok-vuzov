import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VuzCard from './component/VuzCard';
import ProfessionCard from './component/ProfessionCard';
import CareerTestBlock from './component/CareerTestBlock';
import AdmissionCalculator from './component/AdmissionCalculator';
import './css/globalSpecialtyPage.css';

const LEVELS = ['Бакалавриат', 'Магистратура', 'Специалитет', 'Аспирантура'];

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

    const [activeTab, setActiveTab] = useState('');

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

    // Группировка похожих специальностей по уровню (без уровня — не показываем)
    const grouped = useMemo(() => {
        const map = {};
        similar.forEach(item => {
            if (!item.uroven || !LEVELS.includes(item.uroven)) return;
            (map[item.uroven] = map[item.uroven] || []).push(item);
        });
        return LEVELS
            .map(level => ({ level, items: map[level] || [] }))
            .filter(group => group.items.length > 0);
    }, [similar]);

    // Текущая вкладка: выбранная, а если её нет — первая доступная группа
    const currentTab = grouped.some(g => g.level === activeTab)
        ? activeTab
        : (grouped[0]?.level || null);

    if (isLoading) return <div className="container" style={{ padding: '100px' }}>Загрузка...</div>;
    if (!specialty) return <div className="container" style={{ padding: '100px' }}>Специальность не найдена</div>;

    // Фильтрация
    const filteredVuzes = vuzes.filter(v => v.name.toLowerCase().includes(searchVuz.toLowerCase()));

    const matchSearch = (item, query) =>
        `${item.name} ${item.kod || ''}`.toLowerCase().includes(query.toLowerCase());

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
                                <div key={index} className="direction-skill-card">
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


{/* КАЛЬКУЛЯТОР ШАНСОВ */}
{specialty.exams && specialty.exams.length > 0 && (
    <div className="global-specialty-admission" style={{ padding: '0px 20px', marginTop: '40px' }}>
        <AdmissionCalculator kod={kod} exams={specialty.exams} />
    </div>
)}

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
                            {professions
                                .filter(p => matchSearch(p, searchProf))
                                .map((prof) => (
                                    <ProfessionCard key={prof.id} data={prof} type="profession" />
                                ))}
                        </div>
                    </div>
                )}

                {/* ПОХОЖИЕ СПЕЦИАЛЬНОСТИ — с вкладками по уровню */}
                {similar.length > 0 && (
                    <div className="similar-directions" style={{padding: '0px 20px', marginTop: '40px'}}>
                        <h2 className="text-32b" style={{ marginBottom: '20px' }}>Похожие специальности</h2>

                        {/* ВКЛАДКИ ПО УРОВНЮ */}
                        <div style={{ display: 'flex', gap: '40px', marginBottom: '24px' }}>
                            {grouped.map(g => ({ key: g.level, label: g.level })).map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
                                        color: currentTab === tab.key ? 'var(--black)' : 'var(--gray)',
                                        borderBottom: currentTab === tab.key ? '3px solid var(--green)' : '3px solid transparent',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>



                                               {grouped
                                                   .filter(group => group.level === currentTab)
                                                   .map(group => (
                                                       <div key={group.level} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                           {group.items
                                                               .filter(dir => matchSearch(dir, searchSpec))
                                                               .map(dir => (
                                                                   <ProfessionCard
                                                                       key={dir.kod}
                                                                       data={dir}
                                                                       type="specialty"
                                                                       isGlobal={true}
                                                                   />
                                                               ))}
                                                       </div>
                                                   ))}

                        {grouped
                            .filter(group => group.level === currentTab)
                            .every(group => group.items.filter(dir => matchSearch(dir, searchSpec)).length === 0) && (
                            <p className="text-20r" style={{ color: 'var(--gray)' }}>Специальности не найдены</p>
                        )}
                    </div>
                )}

                <CareerTestBlock />
            </div>
        </div>
    );
}
