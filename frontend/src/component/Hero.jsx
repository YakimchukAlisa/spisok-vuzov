import React, { useState, useEffect } from 'react';
import FilterButton from "./FilterButton.jsx";
import { getGoroda, getNapravleniyaList, getExams } from "../api/api";

// Группировка по первой букве (как было в вашей рабочей версии)
const groupByLetter = (array) => {
    if (!array || !Array.isArray(array)) return {};
    const sorted = [...array].sort((a, b) => a.localeCompare(b, 'ru'));
    const grouped = {};
    sorted.forEach(item => {
        const firstLetter = item.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) grouped[firstLetter] = [];
        grouped[firstLetter].push(item);
    });
    return grouped;
};

function Hero() {
    const [cities, setCities] = useState({});
    const [specialties, setSpecialties] = useState({});
    const [exams, setExams] = useState({});

    useEffect(() => {
        getGoroda().then(data => setCities(groupByLetter(data))).catch(console.error);
        getNapravleniyaList().then(data => setSpecialties(groupByLetter(data))).catch(console.error);
        getExams().then(data => setExams(groupByLetter(data))).catch(console.error);
    }, []);

    return (
        <section className="hero">
            <div className="container hero__container">
                <h1 className="hero__title">ПОСТУПИ В ВУЗ МЕЧТЫ</h1>

                <div className="hero__filters-and-search">
                    <div className="field">
                        <input type="text" className="field__input" placeholder=" " />
                        <label className="field__label">Введите название ВУЗа</label>
                        <img src="/search.svg" alt="Поиск" className="field__icon" />
                    </div>

                    <div className="hero__filters">
                        <FilterButton text="Специальность" iconSrc="/teaching.svg" options={specialties} />
                        <FilterButton text="ЕГЭ" iconSrc="/list.svg" options={exams} />
                        <FilterButton text="Город" iconSrc="/location.svg" options={cities} />

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