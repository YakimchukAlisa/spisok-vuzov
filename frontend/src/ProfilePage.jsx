import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/profilePage.css';

export default function ProfilePage() {
  // Имитация получения данных пользователя (в реальности - из базы по токену)
  // Мы сохраняем их в localStorage при регистрации, чтобы показать здесь
  const [userData, setUserData] = useState({
    name: 'Жданова Карина Александровна',
    school: 'Гимназия №74',
    phone: '+7 923 169-52-10',
    email: '14150226c@gmail.com'
  });

  // Если при регистрации мы сохраняли данные в localStorage, можем их подтянуть
  useEffect(() => {
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="container" style={{ marginTop: '100px', gap: '32px' }}>
        
        <h1 className="text-32b">Личный кабинет</h1>

        {/* КАРТОЧКА ПОЛЬЗОВАТЕЛЯ */}
        <div className="profile-card">
          
          {/* Левая часть: Иллюстрация */}
          <div className="profile-card__image-wrapper">
             <img src="/profile-illustration.svg" alt="Профиль" className="profile-card__image" />
          </div>

          {/* Правая часть: Данные */}
          <div className="profile-card__info">
            
            <div className="profile-info-list">
              <div className="profile-info-row">
                <span className="text-20b profile-info-row__label">ФИО:</span>
                <span className="text-14m profile-info-row__value">{userData.name}</span>
              </div>
              
              <div className="profile-info-row">
                <span className="text-20b profile-info-row__label">Школа:</span>
                <span className="text-14m profile-info-row__value">{userData.school}</span>
              </div>
              
              <div className="profile-info-row">
                <span className="text-20b profile-info-row__label">Телефон:</span>
                <span className="text-14m profile-info-row__value">{userData.phone}</span>
              </div>
              
              <div className="profile-info-row">
                <span className="text-20b profile-info-row__label">Почта:</span>
                <span className="text-14m profile-info-row__value">{userData.email}</span>
              </div>
            </div>

            <button className="btn btn--green profile-card__edit-btn">
              Редактировать
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}