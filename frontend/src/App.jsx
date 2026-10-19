import { useState, useEffect } from 'react';
import './css/main.css';
import Header from './component/Header.jsx';
import Footer from './component/Footer.jsx';
import Hero from './component/Hero.jsx';
import CardVuz from "./component/VuzCard.jsx";
import { getVuzCards } from './api/api'; // Импортируем функцию API

function App() {
  // 1. Создаем состояние для списка вузов
  const [vuzList, setVuzList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Загружаем данные при запуске приложения
  useEffect(() => {
    getVuzCards()
      .then(data => {
        setVuzList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки вузов:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <Hero />

      <div className="container">
        {loading ? (
          <p style={{ textAlign: 'center', margin: '40px 0' }}>Загрузка вузов...</p>
        ) : (
          <div className="vuz-list">
            {vuzList.map((vuz) => (
              <CardVuz
                key={vuz.id}
                // ВАЖНО: Приводим данные с бэкенда к формату, который ждет VuzCard
                data={{
                  name: vuz.name,         // Аббревиатура
                  fullName: vuz.fullName, // Полное название
                  imageUrl: vuz.imageUrl || '/img/vuz/default.jpg', // Заглушка, если нет фото
                  budget: {
                    places: vuz.budgetPlaces || 0,
                    minScore: vuz.budgetMinScore || 0
                  },
                  paid: {
                    places: vuz.paidPlaces || 0,
                    minScore: vuz.paidMinScore || 0,
                    minPrice: vuz.paidMinPrice || 0
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default App;