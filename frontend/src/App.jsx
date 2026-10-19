import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/main.css';
import Header from './component/Header.jsx';
import Footer from './component/Footer.jsx';
import Hero from './component/Hero.jsx';
import VuzCard from "./component/VuzCard.jsx";
import vuzData from './DATA/cardVuz.json';
import VuzPage from './VuzPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        
        <main className="main-content">
          <Routes>
            {/* Главная страница */}
            <Route 
              path="/" 
              element={
                <>
                  <Hero />
                  <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
                    <div className="vuz-list">
                      {vuzData.map((vuz) => (
                        <VuzCard 
                          key={vuz.id} 
                          data={vuz} 
                        />
                      ))}
                    </div>
                  </div>
                </>
              } 
            />
            
            {/* Страница конкретного вуза (динамический ID) */}
            <Route path="/vuz/:id" element={<VuzPage />} />
            
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
