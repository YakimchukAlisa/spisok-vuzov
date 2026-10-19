import { useState, useEffect } from 'react';
import FilterButton from "./FilterButton.jsx";
import { getGoroda, getNapravleniyaList, getExams } from "../api/api";

// Функция для группировки массива строк по первой букве
const groupByLetter = (array) => {
    // Сортируем по алфавиту
    const sorted = [...array].sort((a, b) => a.localeCompare(b));

    // Группируем
    const grouped = {};
    sorted.forEach(item => {
        const firstLetter = item.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(item);
    });
    return grouped;
};

function Hero() {
    // Состояния для данных из БД
    const [cities, setCities] = useState({});
    const [specialties, setSpecialties] = useState({});
    const [exams, setExams] = useState({});

    // Загружаем данные при монтировании компонента
   useEffect(() => {
       getGoroda()
           .then(data => setCities(groupByLetter(data))) // Группируем города
           .catch(console.error);

       getNapravleniyaList()
           .then(data => setSpecialties(groupByLetter(data))) // Группируем специальности
           .catch(console.error);

       getExams()
           .then(data => setExams(groupByLetter(data))) // Группируем экзамены
           .catch(console.error);
   }, []);


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
                            options={specialties}
                        />
                        <FilterButton
                            text="ЕГЭ"
                            iconSrc="/list.svg"
                            options={exams}
                        />
                        <FilterButton
                            text="Город"
                            iconSrc="/location.svg"
                            options={cities}
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