import React from 'react';
import { Link } from 'react-router-dom';
import './../css/careerTestBlock.css';

export default function CareerTestBlock() {
  return (
    <div className="career-test">
      
      {/* ЛЕВАЯ ЧАСТЬ: Картинка (или несколько, если это анимация) */}
      <div className="career-test__image-wrapper">
        <img 
          src="/test-illustration.svg" 
          alt="Тест на профориентацию" 
          className="career-test__image" 
        />
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Контент */}
      <div className="career-test__content">
        
        <div className="career-test__text">
          <h2 className="career-test__title">Не знаешь, что выбрать?</h2>
          <p className="career-test__subtitle">Пройди тест на профориентацию!</p>
        </div>

        {/* Список пунктов */}
        <ul className="career-test__list">
          <li className="career-test__item">
            <img src="/1.svg" alt="#" className="career-test__icon" />
            Пройди бесплатный тест
          </li>
          <li className="career-test__item">
            <img src="/2.svg" alt="#" className="career-test__icon" />
            Выбери подходящие профессии
          </li>
          <li className="career-test__item">
            <img src="/3.svg" alt="#" className="career-test__icon" />
            Составь план поступления
          </li>
        </ul>

        <p className="career-test__time">8-10 минут</p>

        {/* Кнопка */}
        <Link to="/career-test" className="btn btn--green career-test__btn">
          Пройти тест
        </Link>

      </div>
    </div>
  );
}