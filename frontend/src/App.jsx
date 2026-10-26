import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/main.css';
import Header from './component/Header.jsx';
import Footer from './component/Footer.jsx';
import Hero from './component/Hero.jsx';
import VuzCard from "./component/VuzCard.jsx";
import vuzData from './DATA/cardVuz.json';
import VuzPage from './VuzPage.jsx';
import FacultyPage from "./FacultyPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        
        <main className="main-content">
          {/* Маршруты должны быть ТОЛЬКО ЗДЕСЬ, внутри функции App */}
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
            
            {/* Страница конкретного вуза */}
            <Route path="/vuz/:id" element={<VuzPage />} />
            
            {/* Страница факультета (С ДВУМЯ ID) */}
            <Route path="/vuz/:vuzId/faculty/:facultyId" element={<FacultyPage />} />
            
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;