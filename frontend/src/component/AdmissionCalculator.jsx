import React, { useState } from 'react';
import axios from 'axios';
import { InputNumber, Select } from 'antd';

const FORMA_OPTIONS = ['Очная', 'Очно-заочная', 'Заочная'];
const OSNOV_OPTIONS = ['Бюджетная основа', 'Полное возмещение затрат', 'Целевое обучение'];

// достраиваем списки из реальных данных, чтобы ничего не потерять
const uniq = (arr, extra) => [...new Set([...extra, ...arr])].filter(Boolean);

export default function AdmissionCalculator({ kod, exams }) {
  const [scores, setScores] = useState({});
  const [results, setResults] = useState(null);
  const [onlyPassed, setOnlyPassed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // фильтры
const [formaFilter, setFormaFilter] = useState('');
const [osnovFilter, setOsnovFilter] = useState('');
const [maxPrice, setMaxPrice] = useState(null);

  if (!exams || exams.length === 0) return null;

  const allFilled = exams.length > 0 &&
    exams.every(exam => scores[exam] != null);

  const check = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/napravlenie/${kod}/admission`,
        scores
      );
      setResults(res.data);
    } catch (err) {
      console.error('Ошибка проверки шансов:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const shown = (results ?? [])
    .filter(r => (onlyPassed ? r.canAdmit : true))
    .filter(r => (formaFilter ? r.forma === formaFilter : true))
    .filter(r => (osnovFilter ? r.osnov === osnovFilter : true))
    .filter(r => {
      if (osnovFilter !== 'Полное возмещение затрат' || !maxPrice) return true;
      return (r.stoimost ?? 0) <= maxPrice;
    });


  const labelStyle = { marginBottom: '6px', fontSize: '15px', fontWeight: 600 };

  return (
    <div style={{ padding: '0px 20px', marginTop: '40px' }}>
      <h2 className="text-28sm" style={{ fontSize: '24px', fontWeight: 700 }}>Калькулятор шансов</h2>
      <p className="text-16r" style={{ color: 'var(--gray)', marginTop: '8px', fontSize: '16px' }}>
        Введите свои баллы ЕГЭ — покажем, на какие профили вы проходите
      </p>

      {/* Поля ввода */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
        {exams.map((exam) => (
          <div key={exam} style={{ display: 'flex', flexDirection: 'column', minWidth: '220px' }}>
            <label className="text-14r" style={labelStyle}>{exam}</label>
            <InputNumber
              min={0}
              max={100}
              precision={0}
              placeholder="0–100"
              style={{ width: '100%', fontSize: '18px' }}
              value={scores[exam] ?? null}
              onChange={(val) => setScores(prev => ({ ...prev, [exam]: val }))}
            />
          </div>
        ))}
      </div>

      <button
        className="btn"
        style={{
          marginTop: '20px',
          background: (!allFilled || isLoading) ? 'var(--gray-light)' : 'var(--green)',
          color: '#fff',
          cursor: (!allFilled || isLoading) ? 'default' : 'pointer',
          fontSize: '17px',
          padding: '12px 24px'
        }}
        onClick={check}
        disabled={!allFilled || isLoading}
      >
        {isLoading ? 'Считаю...' : allFilled ? 'Проверить шансы' : 'Введите баллы'}
      </button>

      {/* Результаты */}
      {results && (
        <div style={{ marginTop: '24px' }}>

          {/* Фильтры */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end', marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={onlyPassed}
                onChange={(e) => setOnlyPassed(e.target.checked)}
              />
              <span className="text-16r" style={{ fontSize: '16px' }}>Только куда прохожу</span>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
              <label className="text-14r" style={labelStyle}>Форма обучения</label>
            <Select
              value={formaFilter}
              onChange={setFormaFilter}
              options={['', ...uniq(results?.map(r => r.forma) ?? [], FORMA_OPTIONS)]
                .map(o => ({ value: o, label: o === '' ? 'Без разницы' : o }))}
            />

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '240px' }}>
              <label className="text-14r" style={labelStyle}>Основание приёма</label>
              <Select
                value={osnovFilter}
                onChange={setOsnovFilter}
                options={['', ...uniq(results?.map(r => r.osnov) ?? [], OSNOV_OPTIONS)]
                  .map(o => ({ value: o, label: o === '' ? 'Без разницы' : o }))}
              />
            </div>

            {osnovFilter === 'Полное возмещение затрат' && (
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: '220px' }}>
                <label className="text-14r" style={labelStyle}>Стоимость до, ₽/год</label>
                <InputNumber
                  min={0}
                  step={5000}
                  precision={0}
                  placeholder="Например, 200 000"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  parser={(value) => value.replace(/\s/g, '')}
                  style={{ width: '100%' }}
                  value={maxPrice}
                  onChange={(val) => setMaxPrice(val)}
                />
              </div>
            )}

            {(formaFilter || osnovFilter || maxPrice) && (
              <button
                className="btn"
                style={{
                  background: 'var(--gray-light)', color: '#262626',
                  padding: '6px 16px', fontSize: '14px'
                }}
                onClick={() => { setFormaFilter(''); setOsnovFilter(''); setMaxPrice(null); }}
              >
                Сбросить фильтры
              </button>
            )}
          </div>

          {shown.length === 0 ? (
            <p className="text-20r" style={{ color: 'var(--gray)', fontSize: '17px' }}>
              {onlyPassed && !formaFilter && !osnovFilter
                ? 'Ни в один профиль вы пока не проходите — попробуйте снять галочку, чтобы увидеть недостающие баллы.'
                : 'Под выбранные фильтры ничего не подходит — выберите «Без разницы» или сбросьте фильтры.'}
            </p>
          ) : (

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(
                shown.reduce((acc, r) => {
                  const key = `${r.vuzName}||${r.facultyName}`;
                  (acc[key] = acc[key] || { vuz: r.vuzName, faculty: r.facultyName, rows: [] }).rows.push(r);
                  return acc;
                }, {})
              ).map(([key, group]) => (
                <div
                  key={key}
                  style={{
                    border: '1px solid var(--gray-light)',
                    borderRadius: '12px',
                    padding: '20px',
                    backgroundColor: '#fff'
                  }}
                >
                  <h3 className="text-20b" style={{ margin: 0, fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
                    {group.vuz}
                  </h3>
                  <p className="text-14r" style={{ color: 'var(--gray)', margin: 0, fontSize: '15px' }}>
                    {group.faculty}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                    {group.rows.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '14px',
                          borderRadius: '8px',
                          background: r.canAdmit
                            ? 'rgba(0,150,0,0.08)'
                            : 'rgba(200,0,0,0.05)',
                          border: '1px solid rgba(0,0,0,0.06)'
                        }}
                      >
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#262626' }}>
                          {r.profileName}
                        </div>

                        <div style={{ fontSize: '15px', color: 'var(--gray)' }}>
                          {r.forma} · {r.osnov}
                        </div>

                        {r.kolMest != null && r.kolMest > 0 && (
                          <div style={{ fontSize: '15px', color: '#555' }}>
                            {r.kolMest} мест
                          </div>
                        )}

                        <div style={{
                          display: 'inline-block',
                          alignSelf: 'flex-start',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          backgroundColor: r.canAdmit ? 'var(--green)' : '#ffebee',
                          color: r.canAdmit ? '#fff' : '#c62828',
                          fontSize: '17px',
                          fontWeight: 700,
                          letterSpacing: '0.5px'
                        }}>
                          {r.canAdmit ? 'Проходите' : 'Не проходите'}
                        </div>

                        <div style={{ fontSize: '16px', lineHeight: '1.4' }}>
                          Ваш балл: {r.totalScore} / проходной: {r.prohodnoi ?? '—'} ({r.god})
                          {r.stoimost > 0 ? ` • ${r.stoimost.toLocaleString('ru-RU')} ₽/год` : ' • бесплатно'}
                        </div>

                        {r.usedSubjects?.length > 0 && (
                          <div style={{ fontSize: '15px', color: '#444', marginTop: '4px' }}>
                            Учтено: {r.usedSubjects.join(', ')}
                          </div>
                        )}

                        {!r.canAdmit && r.missingSubjects?.length > 0 && (
                          <div style={{ fontSize: '15px', color: 'var(--red)', marginTop: '4px', fontWeight: 600 }}>
                            Не хватает: {r.missingSubjects.join('; ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
