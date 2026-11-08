import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/main.css';
import Header from './component/Header.jsx';
import Footer from './component/Footer.jsx';
import Hero from './component/Hero.jsx';
import VuzCard from "./component/VuzCard.jsx";

// Импорт страниц (раскомментируйте нужные, если они у вас есть)
import VuzPage from './VuzPage.jsx';
import FacultyPage from "./FacultyPage.jsx";
import DirectionPage from './DirectionPage';
import CatalogPage from './CatalogPage';
import SpherePage from './SpherePage';
// import GlobalSpecialtyPage from './GlobalSpecialtyPage';
// import ProfessionPage from './ProfessionPage';
// import RatingsPage from './RatingsPage';
// import AuthPage from './AuthPage';
// import ProfilePage from './ProfilePage';
// import FavoritesPage from './FavoritesPage';
// import ComparePage from './ComparePage';
// import TestPage from './TestPage';

// Импорт методов API
import { getVuzCards, getGoroda, getNapravleniyaList, getExams } from "./api/api.js";

function App() {
  // --- СОСТОЯНИЯ ДЛЯ ДАННЫХ С БЭКЕНДА ---
  const [vuzData, setVuzData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [specialtiesData, setSpecialtiesData] = useState([]); // Плоский массив специальностей
  const [examsData, setExamsData] = useState([]);             // Плоский массив экзаменов
  const [isLoading, setIsLoading] = useState(true);

  // --- СОСТОЯНИЯ ДЛЯ ПОИСКА И ФИЛЬТРОВ ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  const [hasDormitory, setHasDormitory] = useState(false);
  const [hasMilitary, setHasMilitary] = useState(false);

  // 1. ЗАГРУЗКА ДАННЫХ ПРИ СТАРТЕ
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем все 4 списка параллельно
        const [vuzList, citiesList, specialtiesList, examsList] = await Promise.all([
          getVuzCards(),
          getGoroda(),
          getNapravleniyaList(),
          getExams()
        ]);

        setVuzData(vuzList);
        setCitiesData(citiesList);
        setSpecialtiesData(specialtiesList);
        setExamsData(examsList);
      } catch (error) {
        console.error("Ошибка при загрузке данных с сервера:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. ГРУППИРОВКА СПЕЦИАЛЬНОСТЕЙ ПО ПЕРВОЙ БУКВЕ (для FilterPopover)
  const dynamicSpecialties = useMemo(() => {
    if (!specialtiesData || specialtiesData.length === 0) return {};

    return specialtiesData.reduce((acc, name) => {
      if (!name) return acc;
      const letter = name[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(name);
      return acc;
    }, {});
  }, [specialtiesData]);

  // 3. ЛОГИКА ФИЛЬТРАЦИИ
  const filteredVuz = vuzData.filter(vuz => {
    // 1. Поиск по названию
    const matchSearch = vuz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (vuz.fullName && vuz.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Фильтр по городам
    const vuzCity = vuz.gorod || vuz.adress || '';
    const matchCity = selectedCities.length === 0 ||
      selectedCities.some(city => vuzCity.includes(city));

    // 3. Фильтр по специальностям (пока заглушка, так как в VuzCardDto нет этой инфы)
    let matchSpecialty = true;
    if (selectedSpecialties.length > 0) {
        matchSpecialty = true;
    }

    // 4. Фильтр по предметам ЕГЭ (пока заглушка)
    let matchExam = true;
    if (selectedExams.length > 0) {
        matchExam = true;
    }

    // 5. Фильтр по общежитию (пока заглушка)
    const matchDormitory = !hasDormitory || true;

    // 6. Фильтр по ВУЦ (пока заглушка)
    const matchMilitary = !hasMilitary || true;

    return matchSearch && matchCity && matchSpecialty && matchExam && matchDormitory && matchMilitary;
  });

  // Экран загрузки
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', fontWeight: 'bold' }}>
        Загрузка списка вузов...
      </div>
    );
  }

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
                  <Hero
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCities={selectedCities}
                    setSelectedCities={setSelectedCities}
                    selectedSpecialties={selectedSpecialties}
                    setSelectedSpecialties={setSelectedSpecialties}
                    selectedExams={selectedExams}
                    setSelectedExams={setSelectedExams}
                    hasDormitory={hasDormitory}
                    setHasDormitory={setHasDormitory}
                    hasMilitary={hasMilitary}
                    setHasMilitary={setHasMilitary}
                    dynamicSpecialties={dynamicSpecialties}
                    citiesData={citiesData}
                    examsData={examsData} // <--- ПЕРЕДАЕМ ЭКЗАМЕНЫ
                  />

                  <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
                    <div className="vuz-list">
                      {filteredVuz.length > 0 ? (
                        filteredVuz.map((vuz) => (
                          <VuzCard
                            key={vuz.id}
                            data={{
                              ...vuz,
                              budget: { places: vuz.budgetPlaces, minScore: vuz.budgetMinScore },
                              paid: { places: vuz.paidPlaces, minScore: vuz.paidMinScore, minPrice: vuz.paidMinPrice },
                              imageUrl: vuz.imageUrl || '/img/default.jpg'
                            }}
                          />
                        ))
                      ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                          <h2 className="text-24b">Ничего не найдено 😢</h2>
                          <p className="text-20r" style={{ color: 'var(--gray-dark)', marginTop: '10px' }}>
                            Попробуйте изменить параметры поиска или сбросить фильтры.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              }
            />

            <Route path="/vuz/:id" element={<VuzPage />} />
             <Route path="/vuz/:vuzId/faculty/:facultyId" element={<FacultyPage />} />
             <Route path="/vuz/:vuzId/faculty/:facultyId/direction/:directionId" element={<DirectionPage />} />
             <Route path="/professions" element={<CatalogPage />} />
             <Route path="/specialties" element={<CatalogPage />} />
             <Route path="/sphere/:sphereId" element={<SpherePage />}  />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;