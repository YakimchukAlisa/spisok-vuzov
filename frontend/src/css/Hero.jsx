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
    dynamicSpecialties
}) {
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
                            options={dynamicSpecialties} // <--- 2. ЗАМЕНИЛИ НА ДИНАМИЧЕСКИЕ
                            selectedValues={selectedSpecialties}
                            onChange={setSelectedSpecialties}
                        />

                        {/* Фильтр Предметы ЕГЭ */}
                        <FilterButton
                            text="ЕГЭ"
                            iconSrc="/list.svg"
                            options={{ "Все предметы": filterData.exams }}
                            selectedValues={selectedExams}
                            onChange={setSelectedExams}
                        />

                        {/* Фильтр Города */}
                        <FilterButton
                            text="Город"
                            iconSrc="/location.svg"
                            options={{ "Все города": filterData.cities }}
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