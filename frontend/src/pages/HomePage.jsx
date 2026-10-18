import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVuzList } from '../api/api';

export default function HomePage() {
  const [vuzList, setVuzList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVuzList()
      .then(data => {
        setVuzList(data);
        setError(null);
      })
      .catch(err => {
        console.error('Ошибка загрузки:', err);
        setError('Не удалось загрузить список вузов. Проверьте, запущен ли backend.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container">Загрузка...</div>;

  if (error) return (
    <div className="container error">
      <p>{error}</p>
      <p>Убедитесь, что backend запущен на http://localhost:8080</p>
    </div>
  );

  return (
    <div className="container">
      <header>
        <h1>Справочник вузов</h1>
        <p>Выберите вуз, чтобы посмотреть направления и условия приёма</p>
      </header>

      {vuzList.length === 0 ? (
        <p>Вузов пока нет. Добавьте их в базу данных.</p>
      ) : (
        <ul className="vuz-list">
          {vuzList.map(vuz => (
            <li key={vuz.id} className="vuz-card">
              <Link to={`/vuz/${vuz.id}`}>
                <h2>{vuz.name}</h2>
                <p className="abbreviatura">{vuz.abbreviatura}</p>
                <p className="info">
                  {vuz.gorod && <span>📍 {vuz.gorod}</span>}
                  {vuz.site && <span>🌐 {vuz.site}</span>}
                </p>
                <p className="contacts">
                  {vuz.phone && <span>📞 {vuz.phone}</span>}
                  {vuz.email && <span>✉️ {vuz.email}</span>}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}