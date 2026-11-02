import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import professionsData from './DATA/professions.json';
import vuzData from './DATA/cardVuz.json';
import spheresData from './DATA/spheres.json';
import VuzCard from './component/VuzCard';
import ProfessionCard from './component/ProfessionCard';
import CareerTestBlock from './component/CareerTestBlock';

export default function ProfessionPage() {
  const { id } = useParams();
  const [searchVuz, setSearchVuz] = useState('');
  const [searchSpec, setSearchSpec] = useState('');

  // 1. Находим профессию и собираем данные о вузах/специальностях
  const { profession, vuzes, relatedSpecialties } = useMemo(() => {
    const foundProfession = professionsData.find(p => p.id === Number(id));
    if (!foundProfession) return { profession: null, vuzes: [], relatedSpecialties: [] };

    const currentSphereId = foundProfession.sphereId;
    let relevantVuzes = [];
    let relevantSpecs = [];
    const uniqueVuzes = new Set();
    const uniqueSpecs = new Set();

    vuzData.forEach(vuz => {
      let hasRelevantSpec = false;

      vuz.faculties?.forEach(faculty => {
        const allDirs = [
          ...(faculty.bachelor?.directionsList || []),
          ...(faculty.master?.directionsList || [])
        ];

        allDirs.forEach(dir => {
          const dirSphereId = dir.sphereIds ? dir.sphereIds[0] : null;
          
          // Если специальность из той же сферы
          if (dirSphereId === currentSphereId) {
            hasRelevantSpec = true;
            
            // Собираем уникальные специальности
            if (!uniqueSpecs.has(dir.code)) {
              uniqueSpecs.add(dir.code);
              
              // Считаем количество вузов для этой специальности
              const vuzesForSpec = new Set();
              vuzData.forEach(v => {
                v.faculties?.forEach(f => {
                  const fDirs = [...(f.bachelor?.directionsList || []), ...(f.master?.directionsList || [])];
                  if (fDirs.some(d => d.code === dir.code)) vuzesForSpec.add(v.id);
                });
              });

              relevantSpecs.push({
                ...dir,
                vuzCount: vuzesForSpec.size
              });
            }
          }
        });
      });

      // Если в вузе есть подходящие специальности, добавляем его
      if (hasRelevantSpec && !uniqueVuzes.has(vuz.id)) {
        uniqueVuzes.add(vuz.id);
        relevantVuzes.push(vuz);
      }
    });

    return { profession: foundProfession, vuzes: relevantVuzes, relatedSpecialties: relevantSpecs };
  }, [id]);

  if (!profession) {
    return <div className="container" style={{ padding: '100px 20px' }}>Профессия не найдена</div>;
  }

  const sphere = spheresData.find(s => s.id === profession.sphereId);

  // Фильтрация
  const filteredVuzes = vuzes.filter(v => v.name.toLowerCase().includes(searchVuz.toLowerCase()));
  const filteredSpecs = relatedSpecialties.filter(s => 
    s.name.toLowerCase().includes(searchSpec.toLowerCase()) || 
    (s.code_name && s.code_name.toLowerCase().includes(searchSpec.toLowerCase()))
  );

  return (
    <div className="wrapper">
      <div className="container" style={{ marginTop: '100px' }}>
        
        {/* ШАПКА ПРОФЕССИИ */}
        <div className="global-specialty-header">
          <h1 className="text-32b" style={{ marginBottom: '16px' }}>{profession.name}</h1>
          <p className="text-20r">{profession.description}</p>
        </div>

        {/* ЧТО ДОЛЖЕН УМЕТЬ */}
        {profession.skills && profession.skills.length > 0 && (
          <div className="profession-skills">
            <h2 className="text-32b" style={{ marginBottom: '32px' }}>
              Что должен уметь {profession.name.toLowerCase()}?
            </h2>
            
            <div className="direction-skills__grid">
              {profession.skills.map((skill, index) => (
                <div key={index} className="direction-skill-card" style={{ alignItems: 'flex-start' }}>
                  <span className="direction-skill-card__number">{index + 1}</span>
                  <span className="text-20r">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* БЛОК ЗАРПЛАТЫ */}
        {profession.salaryLevels && profession.salaryLevels.length > 0 && (
          <div className="profession-salary">
            <h2 className="text-32b" style={{ marginBottom: '24px' }}>
              Зарплата {profession.name.toLowerCase()}а
            </h2>

            {/* Текст-описание */}
            {profession.salaryText && (
              <p className="text-20r" style={{ marginBottom: '40px'}}>
                {profession.salaryText}
              </p>
            )}

            {/* Контейнер для картинки и лестницы */}
            <div className="salary-layout">
              
              {/* Картинка-иллюстрация (SVG) */}
              <div className="salary-image-wrapper">
                <img 
                  src="/salary-illustration.svg" 
                  alt="Зарплата" 
                  className="salary-image" 
                />
              </div>

              {/* Лестница зарплат */}
              <div className="salary-stairs">
                {profession.salaryLevels.map((item, index) => (
                  <div key={index} className="salary-card">
                    <div className="salary-card__text">
                      <span className="text-20b">{item.level}</span>
                      <span className="text-20b" style={{ color: 'var(--green)' }}>{item.amount}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

                {/* КОМУ ПОДОЙДЁТ ПРОФЕССИЯ */}
        {profession.suitableFor && profession.suitableFor.length > 0 && (
          <div className="profession-suitable">
            <h2 className="text-32b" style={{ marginBottom: '24px' }}>
              Кому подойдёт профессия {profession.name.toLowerCase()}?
            </h2>
            
            {/* Текст-описание */}
            {profession.suitableForText && (
              <p className="text-20r" style={{ marginBottom: '32px'}}>
                {profession.suitableForText}
              </p>
            )}

            {/* Сетка с качествами */}
            <div className="direction-skills__grid">
              {profession.suitableFor.map((quality, index) => (
                <div key={index} className="direction-skill-card" style={{ alignItems: 'flex-start' }}>
                  <span className="direction-skill-card__number">{index + 1}</span>
                  <span className="text-20r">{quality}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ПОДХОДЯЩИЕ СПЕЦИАЛЬНОСТИ */}
        <div className="similar-directions">
          <h2 className="text-32b" style={{ marginBottom: '32px'}}>Подходящие специальности</h2>
          
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
            {filteredSpecs.length > 0 ? (
              filteredSpecs.slice(0, 4).map(spec => (
                <ProfessionCard key={spec.id} data={spec} type="specialty" isGlobal={true} />
              ))
            ) : (
              <p className="text-20r" style={{ color: 'var(--gray)' }}>Специальности не найдены</p>
            )}
          </div>
        </div>

        <CareerTestBlock />
      </div>
    </div>
  );
}