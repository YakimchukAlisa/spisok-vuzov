import React from 'react';
import { useParams, Link } from 'react-router-dom';
import vuzData from './DATA/cardVuz.json';
import VuzDetailsHero from './component/VuzDetailsHero';
import FacultyCard from './component/FacultyCard';

export default function VuzPage() {
  // Получаем ID из адресной строки (например, /vuz/1)
  const { id } = useParams();

  // Ищем нужный вуз в нашем JSON
  const vuz = vuzData.find((item) => item.id === Number(id));

  // Если вуза с таким ID нет — показываем сообщение об ошибке
  if (!vuz) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-32b">Вуз не найден</h1>
        <Link to="/" className="btn btn--green" style={{ marginTop: '20px' }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="wrapper">
      {/* Передаем найденные данные в наш Hero-компонент */}
      <VuzDetailsHero data={vuz} />

      {/* Блок с факультетами */}
      <div className="container" style={{ padding: '40px 20px', gap: '32px' }}>
        <h2 className="text-32b">Факультеты</h2>
        
        {/* Проверяем, есть ли у вуза массив faculties и не пустой ли он */}
        {vuz.faculties && vuz.faculties.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {vuz.faculties.map((faculty) => (
              <FacultyCard key={faculty.id} data={faculty} />
            ))}
          </div>
        ) : (
          <p className="text-14r" style={{ color: 'var(--gray)' }}>
            Информация о факультетах для этого вуза пока не добавлена.
          </p>
        )}
      </div>
    </div>
  );
}