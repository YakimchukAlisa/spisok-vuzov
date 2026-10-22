import FilterButton from "./FilterButton.jsx";
import filterData from '../DATA/filters.json';

function Hero() {
    return (
        <section className="hero">
            <div className="container hero__container">

                <h1 className="hero__title">
                    ПОСТУПИ В ВУЗ МЕЧТЫ
                </h1>

                <div className="hero__filters-and-search">
                    <div className="field">
                        <input
                            type="text"
                            className="field__input"
                            placeholder=" "
                        />
                        <label className="field__label">Введите название ВУЗа</label>
                        <img src="/search.svg" alt="Поиск" className="field__icon" />
                    </div>
                    <div className="hero__filters">
                        <FilterButton
                            text="Специальность"
                            iconSrc="/teaching.svg"
                            options={filterData.specialties}
                        />
                        <FilterButton
                            text="ЕГЭ"
                            iconSrc="/list.svg"
                             options={{ "Все предметы": filterData.exams }} 
                        />
                        <FilterButton
                            text="Город"
                            iconSrc="/location.svg"
                            options={{ "Все города": filterData.cities }}
                        />
                        <label className="btn btn--gray-light btn--with-icon hero__toggle">
                            <input type="checkbox" className="toggle-input" />
                            <span className="toggle-switch"></span>
                            Общежитие
                        </label>

                        <label className="btn btn--gray-light btn--with-icon hero__toggle">
                            <input type="checkbox" className="toggle-input" />
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