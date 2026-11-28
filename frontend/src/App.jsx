import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './css/main.css';

// Компоненты
import Header from './component/Header.jsx';
import Footer from './component/Footer.jsx';
import Hero from './component/Hero.jsx';
import VuzCard from "./component/VuzCard.jsx";

// Страницы
import VuzPage from './VuzPage.jsx';
import FacultyPage from "./FacultyPage.jsx";
import DirectionPage from './DirectionPage';
import CatalogPage from './CatalogPage';
import SpherePage from './SpherePage';
import GlobalSpecialtyPage from './GlobalSpecialtyPage';
import ProfessionPage from './ProfessionPage';
import RatingsPage from './RatingsPage';
import AuthPage from './AuthPage';
import ProfilePage from './ProfilePage';
import FavoritesPage from './FavoritesPage';
import ComparePage from './ComparePage';
import TestPage from './TestPage';
import { AdminApp } from './admin/AdminApp';

// Импорт методов API
import { getVuzCards, getGoroda, getNapravleniyaList, getExams } from "./api/api.js";

function App() {
  // --- СОСТОЯНИЯ ДЛЯ ДАННЫХ С БЭКЕНДА ---
  const [vuzData, setVuzData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [specialtiesData, setSpecialtiesData] = useState([]);
  const [examsData, setExamsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- СОСТОЯНИЯ ДЛЯ ПОИСКА И ФИЛЬТРОВ ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  const [hasDormitory, setHasDormitory] = useState(false);
  const [hasMilitary, setHasMilitary] = useState(false);

  // --- ЗАГРУЗКА ДАННЫХ ПРИ СТАРТЕ ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vuzList, citiesList, specialtiesList, examsList] = await Promise.all([
          getVuzCards(),
          getGoroda(),
          getNapravleniyaList(),
          getExams()
        ]);

                setVuzData(vuzList.map(v => ({
                  ...v,
                  napravleniya: v.napravleniya ? v.napravleniya.split('|').filter(Boolean) : [],
                  exams: v.exams ? v.exams.split('|').filter(Boolean) : [],
                })));

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

  // --- ГРУППИРОВКА СПЕЦИАЛЬНОСТЕЙ ---
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

   // --- ЛОГИКА ФИЛЬТРАЦИИ ---
   const filteredVuz = useMemo(() => vuzData.filter(vuz => {
     // 1. Поиск по названию
     const q = searchQuery.trim().toLowerCase();
     const matchSearch = !q ||
       vuz.name.toLowerCase().includes(q) ||
       (vuz.fullName && vuz.fullName.toLowerCase().includes(q));

     // 2. Город
     const vuzCity = vuz.gorod || vuz.adress || '';
     const matchCity = selectedCities.length === 0 ||
       selectedCities.some(city => vuzCity.includes(city));

     // 3. Специальность: вуз подходит, если у него есть направление с выбранным названием
     //    (napravleniya может быть массивом строк или объектов — поддерживаем оба варианта)
     const vuzSpecNames = (vuz.napravleniya || []).map(n =>
       typeof n === 'string' ? n : n.name
     );
     const matchSpecialty = selectedSpecialties.length === 0 ||
       selectedSpecialties.some(s => vuzSpecNames.includes(s));

     // 4. ЕГЭ: «Все предметы» пропускает всё, иначе — совпадение хотя бы одного предмета
     const vuzExams = vuz.exams || [];
     const matchExam = selectedExams.length === 0 ||
       selectedExams.includes('Все предметы') ||
       selectedExams.some(e => vuzExams.includes(e));

     // 5. Тумблеры: поле вуза из БД, поддерживаем и true, и строку "true"
     const matchDormitory = !hasDormitory ||
       vuz.obsheszhitye === true || vuz.obsheszhitye === 'true';
     const matchMilitary = !hasMilitary ||
       vuz.voennayaKafedra === true || vuz.voennayaKafedra === 'true';

     return matchSearch && matchCity && matchSpecialty && matchExam && matchDormitory && matchMilitary;
   }), [vuzData, searchQuery, selectedCities, selectedSpecialties, selectedExams, hasDormitory, hasMilitary]);


  // --- ЭКРАН ЗАГРУЗКИ ---
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', fontWeight: 'bold' }}>
        Загрузка списка вузов...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================== */}
        {/* 1. МАРШРУТЫ АДМИНКИ (БЕЗ ОСНОВНОГО ХЭДЭРА)  */}
        {/* ========================================== */}
<Route
  path="/admin/*"
  element={
    localStorage.getItem('isAdmin') === 'true'
      ? <AdminApp />
      : <Navigate to="/auth" replace />
  }
/>


        {/* ========================================== */}
        {/* 2. МАРШРУТЫ ОСНОВНОГО САЙТА (С ХЭДЭРОМ)    */}
        {/* ========================================== */}
        <Route
          path="/*"
          element={
            <div className="wrapper">
              <Header />
              <main className="main-content">
                <Routes>
                  {/* ГЛАВНАЯ */}
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
                          examsData={examsData}
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

                  {/* ВУЗЫ И НАПРАВЛЕНИЯ */}
                  <Route path="/vuz/:id" element={<VuzPage />} />
                  <Route path="/vuz/:vuzId/faculty/:facultyId" element={<FacultyPage />} />
                  <Route path="/vuz/:vuzId/faculty/:facultyId/direction/:directionId" element={<DirectionPage />} />
                  
                  {/* КАТАЛОГИ */}
                  <Route path="/professions" element={<CatalogPage />} />
                  <Route path="/specialties" element={<CatalogPage />} />
                  <Route path="/sphere/:sphereId" element={<SpherePage />} />
                  
                  {/* ГЛОБАЛЬНЫЕ СУЩНОСТИ */}
                  <Route path="/napravlenie/:kod" element={<GlobalSpecialtyPage />} />
                  
                  {/* ОСТАЛЬНЫЕ СТРАНИЦЫ */}
                  <Route path="/ratings" element={<RatingsPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/career-test" element={<TestPage />} />
                  <Route path="/profession/:id" element={<ProfessionPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;