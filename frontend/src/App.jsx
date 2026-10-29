import React, { useState, useMemo } from 'react'; // <--- ДОБАВИЛИ useMemo
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/main.css';
import Header from './component/Header.jsx';
import Footer from './component/Footer.jsx';
import Hero from './component/Hero.jsx';
import VuzCard from "./component/VuzCard.jsx";
import vuzData from './DATA/cardVuz.json';
import VuzPage from './VuzPage.jsx';
import FacultyPage from "./FacultyPage.jsx";
import DirectionPage from './DirectionPage';
import CatalogPage from './CatalogPage';


function App() {
  // Состояния для поиска и фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  const [hasDormitory, setHasDormitory] = useState(false);
  const [hasMilitary, setHasMilitary] = useState(false);

  // 1. АВТОМАТИЧЕСКИЙ СБОР СПЕЦИАЛЬНОСТЕЙ (Мемоизация)
  // Пересчитывается только при первом рендере (так как vuzData не меняется)
  const dynamicSpecialties = useMemo(() => {
    const allSpecialties = new Set(); // Set убирает дубликаты

    vuzData.forEach(vuz => {
      vuz.faculties?.forEach(faculty => {
        const dirs = [
          ...(faculty.bachelor?.directionsList || []),
          ...(faculty.master?.directionsList || [])
        ];
        dirs.forEach(dir => {
          allSpecialties.add(dir.name); // Собираем только названия
        });
      });
    });

    // Сортируем по алфавиту
    const sorted = Array.from(allSpecialties).sort();

    // Группируем по первой букве
    return sorted.reduce((acc, spec) => {
      const firstLetter = spec[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(spec);
      return acc;
    }, {});
  }, []); // Пустой массив зависимостей означает, что считаем 1 раз

  // ЛОГИКА ФИЛЬТРАЦИИ
  const filteredVuz = vuzData.filter(vuz => {
    // 1. Поиск по названию
    const matchSearch = vuz.name.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Фильтр по городам
    const matchCity = selectedCities.length === 0 ||
      selectedCities.some(city => vuz.address.includes(city));

    // 3. Фильтр по специальностям и предметам
    let matchSpecialty = selectedSpecialties.length === 0;
    let matchExam = selectedExams.length === 0;

    if (vuz.faculties) {
      vuz.faculties.forEach(fac => {
        const dirs = [...(fac.bachelor?.directionsList || []), ...(fac.master?.directionsList || [])];

        dirs.forEach(dir => {
          // Проверяем специальность
          if (selectedSpecialties.some(spec => dir.name.includes(spec) || dir.code.includes(spec))) {
            matchSpecialty = true;
          }
          // Проверяем предметы
          if (dir.exams && dir.exams.some(exam => selectedExams.includes(exam))) {
            matchExam = true;
          }
        });
      });
    }

    // 4. Фильтр по общежитию
    const matchDormitory = !hasDormitory ||
      (vuz.features && vuz.features.includes("Общежитие"));

    // 5. Фильтр по ВУЦ
    const matchMilitary = !hasMilitary ||
      (vuz.features && vuz.features.includes("Военный учебный центр"));

    return matchSearch && matchCity && matchSpecialty && matchExam && matchDormitory && matchMilitary;
  });

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
                    dynamicSpecialties={dynamicSpecialties} // <--- ПЕРЕДАЕМ В HERO
                  />

                  <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
                    <div className="vuz-list">
                      {filteredVuz.length > 0 ? (
                        filteredVuz.map((vuz) => (
                          <VuzCard key={vuz.id} data={vuz} />
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
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;