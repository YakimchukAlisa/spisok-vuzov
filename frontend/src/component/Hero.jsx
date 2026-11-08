import React from 'react';
import FilterButton from "./FilterButton.jsx";
import filterData from '../DATA/filters.json';

function Hero({
    searchQuery,
    setSearchQuery,
    selectedSpecialties,
    setSelectedSpecialties,
    selectedExams,
    setSelectedExams,
    selectedCities,
    setSelectedCities,
    hasDormitory, setHasDormitory,
    hasMilitary, setHasMilitary,
    dynamicSpecialties,
    citiesData = [], // Данные с бэкенда
    examsData = []   // Данные с бэкенда
}) {
    // Безопасная проверка для городов: если с бэкенда пусто, используем JSON
    const availableCities = citiesData && citiesData.length > 0
        ? citiesData
        : filterData.cities;

    // Безопасная проверка для экзаменов: если с бэкенда пусто, используем JSON
    const availableExams = examsData && examsData.length > 0
        ? examsData
        : filterData.exams;

    return (
        <section className="hero">
            <div className="container hero__container">

                <h1 className="hero__title">
                    ПОСТУПИ В ВУЗ МЕЧТЫ
                </h1>

                <div className="hero__filters-and-search">

                    {/* Поле поиска */}
                    <div className="field">
                        <input
                            type="text"
                            className="field__input"
                            placeholder=" "
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <label className="field__label">Введите название ВУЗа</label>
                        <img src="/search.svg" alt="Поиск" className="field__icon" />
                    </div>

                    <div className="hero__filters">
                        {/* Фильтр Специальности */}
                        <FilterButton
                            text="Специальность"
                            iconSrc="/teaching.svg"
                            options={dynamicSpecialties}
                            selectedValues={selectedSpecialties}
                            onChange={setSelectedSpecialties}
                        />

                        {/* Фильтр Предметы ЕГЭ (ИЗ БД) */}
                        <FilterButton
                            text="ЕГЭ"
                            iconSrc="/list.svg"
                            options={{ "Все предметы": availableExams }}
                            selectedValues={selectedExams}
                            onChange={setSelectedExams}
                        />

                        {/* Фильтр Города (ИЗ БД) */}
                        <FilterButton
                            text="Город"
                            iconSrc="/location.svg"
                            options={{ "Все города": availableCities }}
                            selectedValues={selectedCities}
                            onChange={setSelectedCities}
                        />

                        {/* Тумблер Общежитие */}
                        <label className={`btn btn--with-icon ${hasDormitory ? 'btn--gray-dark' : 'btn--gray-light'}`} style={{ cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                className="toggle-input"
                                checked={hasDormitory}
                                onChange={(e) => setHasDormitory(e.target.checked)}
                            />
                            <span className="toggle-switch"></span>
                            Общежитие
                        </label>

                        {/* Тумблер ВУЦ */}
                        <label className={`btn btn--with-icon ${hasMilitary ? 'btn--gray-dark' : 'btn--gray-light'}`} style={{ cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                className="toggle-input"
                                checked={hasMilitary}
                                onChange={(e) => setHasMilitary(e.target.checked)}
                            />
                            <span className="toggle-switch"></span>
                            ВУЦ
                        </label>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Hero;