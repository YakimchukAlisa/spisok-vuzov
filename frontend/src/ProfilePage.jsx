import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from './component/FavoritesContext.jsx';
import { getProfile, updateProfile, getTestResults, getTest } from './api/api.js';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const phone = localStorage.getItem('currentPhone');
    if (!phone) {
      navigate('/auth');
      return;
    }

    // ----- Профиль с бэкенда -----
    getProfile(phone)
      .then(data => {
        const profile = {
          name: data.name || '',
          school: data.school || 'Не указана',
          phone: data.phone || phone,
          email: data.email || ''
        };
        setUserData(profile);
        setEditForm(profile);
        setIsLoading(false);

        // ----- Результаты теста из базы -----
        const userId = data.id ?? data.userId ?? 5; // id из ответа профиля, 5 — fallback

        return Promise.all([getTestResults(userId), getTest(1)]);
      })
      .then(([resultsRes, testData]) => {
        if (!resultsRes) return;

        // сопоставляем названия сфер с их id — для кнопок «Профессии/Специальности»
        const nameToId = {};
        ((testData && testData.spheres) || []).forEach(s => {
          nameToId[s.name] = s.id;
        });

        const results = (resultsRes.data || []).map(r => {
          const d = r.dataProhozhdenia ? new Date(r.dataProhozhdenia) : null;
          return {
            date: d ? d.toLocaleDateString('ru-RU') : '',
            time: d
              ? d.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '',
            timestamp: d ? d.getTime() : 0,
           spheres: (r.sfery || '')
             .split(';')
             .map(n => n.trim())
             .filter(Boolean)
             .map(n => ({ id: nameToId[n] ?? null, name: n }))

          };
        });

        // сначала новые
        results.sort((a, b) => b.timestamp - a.timestamp);
        setTestResults(results);
      })
      .catch(err => {
        console.error('Ошибка загрузки профиля:', err);
        setError('Не удалось загрузить профиль');
        setIsLoading(false);
        // Если пользователь не найден — на страницу входа
        if (err.response?.status === 404) {
          localStorage.removeItem('currentPhone');
          navigate('/auth');
        }
      });
  }, [navigate]);

  const handleEdit = () => {
    setEditForm({ ...userData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        phone: userData.phone,
        name: editForm.name,
        email: editForm.email
      });
      setUserData(editForm);
      setIsEditing(false);
    } catch (err) {
      console.error('Ошибка сохранения профиля:', err);
      setError(err.response?.data?.error || 'Не удалось сохранить профиль');
    }
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    localStorage.removeItem('currentPhone');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userProfile');
    logout();
    navigate('/');
  };
  const cancelLogout = () => setShowLogoutModal(false);

  const formatDateTime = (test) => {
    if (test.date && test.time) return `${test.date}, ${test.time}`;
    if (test.date) return test.date;
    return '—';
  };

  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="container" style={{ marginTop: '100px' }}>
          Загрузка профиля...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <div className="container" style={{ marginTop: '100px' }}>
          {error}
        </div>
      </div>
    );
  }

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
                    value={editForm.name || ''}
                    onChange={e =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                ) : (
                  <span className="text-14m profile-info-row__value">
                    {userData.name || 'Не указано'}
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
                    value={editForm.phone || ''}
                    onChange={e =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                  />
                ) : (
                  <span className="text-14m profile-info-row__value">
                    {userData.phone || 'Не указан'}
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
                    value={editForm.email || ''}
                    onChange={e =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                ) : (
                  <span className="text-14m profile-info-row__value">
                    {userData.email || 'Не указана'}
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

        {testResults.length > 0 &&
          testResults.map((test, idx) => (
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
                Дата прохождения: <strong>{formatDateTime(test)}</strong>
              </p>

              {test.spheres.length > 0 ? (
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
                    {test.spheres.map((sphere, i) => (
                      <div
                        key={sphere.id ?? `${sphere.name}-${i}`}
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
                        {sphere.id !== null && (
                          <>
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
                          </>
                        )}
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
          ))}
      </div>

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
