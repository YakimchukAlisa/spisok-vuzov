import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from './component/FavoritesContext.jsx';
import './css/profilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useFavorites();

  const [userData, setUserData] = useState({
    name: '',
    school: '',
    phone: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // массив всех сохранённых тестов
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    // ----- Профиль -----
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      setEditForm(parsed);
    } else {
      const mock = {
        name: 'Карина',
        school: 'Не указана',
        phone: '+7 923 169 52 10',
        email: '14150226c@gmail.com'
      };
      setUserData(mock);
      setEditForm(mock);
    }

    // ----- Тесты -----
    let results = [];

    const savedArr = localStorage.getItem('careerTestResults');
    if (savedArr) {
      try {
        results = JSON.parse(savedArr) || [];
      } catch {
        results = [];
      }
    }

    // Миграция: если массив пуст, но есть старый одиночный результат
    if (results.length === 0) {
      const legacy = localStorage.getItem('careerTestResult');
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          results = [parsed];
          // записываем в новый формат, чтобы больше не мигрировать
          localStorage.setItem('careerTestResults', JSON.stringify(results));
        } catch {
          /* ignore */
        }
      }
    }

    // сортировка: свежие сверху
    results.sort((a, b) => {
      const ta = a.timestamp ?? 0;
      const tb = b.timestamp ?? 0;
      if (ta !== tb) return tb - ta;
      // если timestamp нет — оставляем как есть
      return 0;
    });

    setTestResults(results);
  }, []);

  const handleEdit = () => {
    setEditForm({ ...userData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(editForm);
    localStorage.setItem('userProfile', JSON.stringify(editForm));
    setIsEditing(false);
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    logout();
    navigate('/');
  };
  const cancelLogout = () => setShowLogoutModal(false);

  // ----- утилиты -----
  const getSpheres = (test) => {
    // [{id, name}]
    if (
      Array.isArray(test.spheres) &&
      test.spheres.length &&
      typeof test.spheres[0] === 'object'
    ) {
      return test.spheres;
    }
    // строка "A, B" + sphereIds [1, 2]
    if (typeof test.spheres === 'string' && Array.isArray(test.sphereIds)) {
      const names = test.spheres.split(',').map(s => s.trim());
      return test.sphereIds.map((id, i) => ({
        id,
        name: names[i] || 'Сфера'
      }));
    }
    return [];
  };

  const formatDateTime = (test) => {
    if (test.date && test.time) return `${test.date}, ${test.time}`;
    if (test.date) return test.date;
    if (test.timestamp) {
      return new Date(test.timestamp).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return '—';
  };

  return (
    <div className="wrapper">
      <div
        className="container"
        style={{ marginTop: '100px', marginBottom: '100px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h1 className="text-32b">Личный кабинет</h1>
          <button
            onClick={handleLogoutClick}
            className="btn btn--green-outline text-14m"
            style={{ width: 'fit-content' }}
          >
            Выйти
          </button>
        </div>

        {/* ---------- Карточка профиля ---------- */}
        <div className="profile-card" style={{ marginTop: '32px' }}>
          <div className="profile-card__image-wrapper">
            <img
              src="profile-illustration.svg"
              alt="Аватар"
              className="profile-card__image"
            />
          </div>

          <div className="profile-card__info">
            <div className="profile-info-list">
              {/* ФИО */}
              <div
                className={`profile-info-row ${
                  isEditing ? 'profile-info-row--editing' : ''
                }`}
              >
                <span className="text-20b profile-info-row__label">ФИО:</span>
                {isEditing ? (
                  <input
                    className="profile-info-row__input"
                    value={editForm.name}
                    onChange={e =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                ) : (
                  <span className="text-14m profile-info-row__value">
                    {userData.name}
                  </span>
                )}
              </div>

              {/* Телефон */}
              <div
                className={`profile-info-row ${
                  isEditing ? 'profile-info-row--editing' : ''
                }`}
              >
                <span className="text-20b profile-info-row__label">
                  Телефон:
                </span>
                {isEditing ? (
                  <input
                    className="profile-info-row__input"
                    value={editForm.phone}
                    onChange={e =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                  />
                ) : (
                  <span className="text-14m profile-info-row__value">
                    {userData.phone}
                  </span>
                )}
              </div>

              {/* Почта */}
              <div
                className={`profile-info-row ${
                  isEditing ? 'profile-info-row--editing' : ''
                }`}
              >
                <span className="text-20b profile-info-row__label">Почта:</span>
                {isEditing ? (
                  <input
                    className="profile-info-row__input"
                    value={editForm.email}
                    onChange={e =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                ) : (
                  <span className="text-14m profile-info-row__value">
                    {userData.email}
                  </span>
                )}
              </div>
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button
                  className="btn btn--green profile-card__edit-btn"
                  onClick={handleSave}
                >
                  Сохранить
                </button>
                <button
                  className="btn btn--green-outline profile-card__edit-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Отмена
                </button>
              </div>
            ) : (
              <button
                className="btn btn--green profile-card__edit-btn"
                onClick={handleEdit}
              >
                Редактировать
              </button>
            )}
          </div>
        </div>

        {/* ---------- Все сохранённые тесты ---------- */}
        {testResults.length > 0 &&
          testResults.map((test, idx) => {
            const spheres = getSpheres(test);
            return (
              <div
                key={test.timestamp || idx}
                style={{
                  marginTop: '40px',
                  padding: '32px',
                  backgroundColor: 'var(--green-light-1)',
                  borderRadius: '20px'
                }}
              >
                <h2 className="text-28sm" style={{ marginBottom: '16px' }}>
                  Результаты профориентации
                </h2>
                <p
                  className="text-16r"
                  style={{ marginBottom: '8px', color: 'var(--black)' }}
                >
                  Дата прохождения:{' '}
                  <strong>{formatDateTime(test)}</strong>
                </p>

                {spheres.length > 0 ? (
                  <>
                    <p
                      className="text-20b"
                      style={{
                        color: 'var(--black)',
                        marginBottom: '24px'
                      }}
                    >
                      Вам подходит:
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                    >
                      {spheres.map(sphere => (
                        <div
                          key={sphere.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            flexWrap: 'wrap'
                          }}
                        >
                          <span
                            className="text-20b"
                            style={{
                              minWidth: '180px',
                              color: 'var(--black)'
                            }}
                          >
                            {sphere.name}
                          </span>
                          <a
                            href={`/sphere/${sphere.id}?type=profession`}
                            className="btn btn--green text-14m"
                          >
                            Профессии
                          </a>
                          <a
                            href={`/sphere/${sphere.id}?type=specialty`}
                            className="btn btn--green text-14m"
                          >
                            Специальности
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p
                    className="text-14r"
                    style={{ color: 'var(--gray-dark)' }}
                  >
                    Нет данных о подходящих сферах.
                  </p>
                )}
              </div>
            );
          })}
      </div>

      {/* ---------- Модалка выхода ---------- */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-24b" style={{ marginBottom: '16px' }}>
              Вы уверены, что хотите выйти?
            </h2>
            <p
              className="text-14r"
              style={{
                color: 'var(--gray-dark)',
                marginBottom: '32px'
              }}
            >
              Все несохраненные изменения будут потеряны.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}
            >
              <button
                className="btn btn--green-outline"
                onClick={cancelLogout}
              >
                Отмена
              </button>
              <button className="btn btn--green" onClick={confirmLogout}>
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}