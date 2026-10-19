import React from 'react';
import { useParams, Link } from 'react-router-dom';
import vuzData from './DATA/cardVuz.json';
import VuzDetailsHero from './component/VuzDetailsHero';

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

      {/* Здесь позже будут факультеты, описание и т.д. */}
      <div className="container" style={{ padding: '40px 20px' }}>
        <h2 className="text-32b">Факультеты (в разработке)</h2>
      </div>
    </div>
  );
}