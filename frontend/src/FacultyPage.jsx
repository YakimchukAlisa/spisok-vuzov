import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import vuzData from './DATA/cardVuz.json';
import DirectionCard from './component/DirectionCard';
import VuzDetailsHero from './component/VuzDetailsHero';


export default function FacultyPage() {
  // 1. Получаем ОБА ID из адресной строки
  const { vuzId, facultyId } = useParams();

  // Состояние для переключения вкладок
  const [activeTab, setActiveTab] = useState('bachelor');

  // 2. Ищем нужный вуз по ID
  const vuz = vuzData.find((v) => v.id === Number(vuzId));

  // 3. Ищем нужный факультет ВНУТРИ этого вуза
  const faculty = vuz?.faculties?.find((f) => f.id === Number(facultyId));

  // Если вуз или факультет не найдены — показываем ошибку
  if (!vuz || !faculty) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-32b">Факультет не найден 😢</h1>
        <Link to="/" className="btn btn--green" style={{ marginTop: '20px' }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  // 4. Получаем список направлений для активной вкладки (bachelor или master)
  const directions = faculty[activeTab]?.directionsList || [];

  return (
    <div className="wrapper">
      <VuzDetailsHero data={vuz} />
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="containerDirections" >
          {/* Вкладки (Бакалавриат / Магистратура) */}
          <div style={{ display: 'flex', gap: '40px' }}>
            <button
              onClick={() => setActiveTab('bachelor')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
                color: activeTab === 'bachelor' ? 'var(--black)' : 'var(--gray)',
                borderBottom: activeTab === 'bachelor' ? '3px solid var(--green)' : '3px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              Бакалавриат
            </button>

            <button
              onClick={() => setActiveTab('master')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0 0 8px 0', fontSize: '24px', fontWeight: '700',
                color: activeTab === 'master' ? 'var(--black)' : 'var(--gray)',
                borderBottom: activeTab === 'master' ? '3px solid var(--green)' : '3px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              Магистратура
            </button>
          </div>

          {/* Список карточек направлений */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {directions.length > 0 ? (
              directions.map((dir) => (
                <DirectionCard key={dir.id} data={dir} facultyLogo={faculty.imageUrl} />
              ))
            ) : (
              <p className="text-14r" style={{ color: 'var(--gray)' }}>
                Направления пока не добавлены.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}