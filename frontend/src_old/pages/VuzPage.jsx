import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVuzById } from '../api/api';

export default function VuzPage() {
  const { id } = useParams();
  const [vuz, setVuz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVuzById(id)
      .then(setVuz)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Загрузка...</div>;
  if (!vuz) return <div className="container">Вуз не найден</div>;

  return (
    <div className="container">
      <Link to="/" className="back-link">← Назад к списку</Link>

      <h1>{vuz.name}</h1>
      <p className="abbreviatura">{vuz.abbreviatura}</p>

      <div className="vuz-details">
        {vuz.gorod && <p><strong>Город:</strong> {vuz.gorod}</p>}
        {vuz.site && <p><strong>Сайт:</strong> <a href={vuz.site}>{vuz.site}</a></p>}
        {vuz.email && <p><strong>Email:</strong> {vuz.email}</p>}
        {vuz.phone && <p><strong>Телефон:</strong> {vuz.phone}</p>}
      </div>
    </div>
  );
}