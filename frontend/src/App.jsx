import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './css/main.css';
import Header from './component/Header.jsx';
import Footer from './component/Footer.jsx';
import Hero from './component/Hero.jsx';
import VuzCard from './component/VuzCard.jsx';
import VuzPage from './VuzPage.jsx';
import { getVuzCards } from './api/api';   //  импорт функции

function App() {
  const [vuzData, setVuzData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVuzCards()
      .then(data => { setVuzData(data); setLoading(false); })
      .catch(err => { console.error('Ошибка загрузки карточек:', err); setLoading(false); });
  }, []);

  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
                    {loading ? (
                      <p>Загрузка...</p>
                    ) : (
                      <div className="vuz-list">
                        {vuzData.map((vuz) => (
                          <VuzCard key={vuz.id} data={vuz} />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              }
            />
            <Route path="/vuz/:id" element={<VuzPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;