import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/authPage.css';
import { useFavorites } from './component/FavoritesContext';
import { sendCode, verifyCode, adminLogin, registerUser } from './api/api.js';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useFavorites();

  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('+7 ');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [profileData, setProfileData] = useState({ name: '', email: '' });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- ФОРМАТИРОВАНИЕ БЕЗ СКОБОК ---
  const formatPhoneNumber = (value) => {
    let digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '+7 ';
    if (digits.startsWith('8')) {
      digits = '7' + digits.substring(1);
    }
    if (!digits.startsWith('7')) {
      digits = '7' + digits;
    }
    digits = digits.substring(0, 11);

    let formatted = '+7';
    const numberPart = digits.substring(1);
    if (numberPart.length > 0) formatted += ` ${numberPart.substring(0, 3)}`;
    if (numberPart.length > 3) formatted += ` ${numberPart.substring(3, 6)}`;
    if (numberPart.length > 6) formatted += ` ${numberPart.substring(6, 8)}`;
    if (numberPart.length > 8) formatted += ` ${numberPart.substring(8, 10)}`;
    return formatted;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  // --- ШАГ 1: Отправка кода ---
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 11) {
      setError('Введите номер телефона полностью');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await sendCode(phone);
      setStep('code');
    } catch (err) {
      setError(err.response?.data?.error || 'Не удалось отправить код');
    } finally {
      setIsLoading(false);
    }
  };

  // --- ШАГ 2: Проверка кода ---
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
    const response = await verifyCode(phone, code);
    // response = { message, phone, isNewUser, isAdmin, userId }

    if (response.isAdmin) {
      setStep('admin_password');
    } else if (response.isNewUser) {
      setStep('profile');
    } else {
      localStorage.setItem('currentPhone', phone);
      login(response.userId);
      navigate('/profile');
     }

    } catch (err) {
      setError(err.response?.data?.error || 'Неверный код');
    } finally {
      setIsLoading(false);
    }
  };

  // --- ШАГ 3: Пароль админа ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await adminLogin(phone, password);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('currentPhone', phone);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Неверный пароль');
    } finally {
      setIsLoading(false);
    }
  };

  // --- ШАГ 4: Профиль ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await registerUser(phone, profileData.name, profileData.email);
      localStorage.setItem('currentPhone', phone);
      login(res.userId);   // register теперь возвращает userId; если api.js оборачивает в axios — res.data.userId
      navigate('/profile');


    } catch (err) {
      setError(err.response?.data?.error || 'Не удалось сохранить профиль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* ШАГ 1: Ввод телефона */}
        {step === 'phone' && (
          <form onSubmit={handleSendCode} className="auth-form">
            <h2 className="text-32b" style={{ marginBottom: '8px' }}>Вход или регистрация</h2>
            <p className="text-14r" style={{ color: 'var(--gray)', marginBottom: '32px' }}>
              Введите номер телефона, привязанный к Telegram. Код придёт в чат «Verification Codes».
            </p>

            <div className="field" style={{ marginBottom: '24px' }}>
              <input
                type="tel"
                className="field__input"
                placeholder=" "
                value={phone}
                onChange={handlePhoneChange}
                maxLength="16"
                required
              />
              <label className="field__label">Номер телефона</label>
            </div>

            {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}

            <button type="submit" className="btn btn--green auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Отправка...' : 'Получить код'}
            </button>
          </form>
        )}

        {/* ШАГ 2: Ввод кода */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="auth-form">
            <button type="button" className="auth-back-btn" onClick={() => setStep('phone')}>
              &larr; Изменить номер
            </button>
            <h2 className="text-32b" style={{ marginBottom: '8px' }}>Введите код</h2>
            <p className="text-14r" style={{ color: 'var(--gray)', marginBottom: '32px' }}>
              Мы отправили код на номер {phone} в Telegram
            </p>
            <div className="field" style={{ marginBottom: '24px' }}>
              <input
                type="text"
                className="field__input"
                placeholder=" "
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength="6"
                required
              />
              <label className="field__label">Код из Telegram</label>
            </div>
            {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
            <button type="submit" className="btn btn--green auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Проверка...' : 'Далее'}
            </button>
          </form>
        )}

        {/* ШАГ 3: Пароль админа */}
        {step === 'admin_password' && (
          <form onSubmit={handleAdminLogin} className="auth-form">
            <h2 className="text-32b" style={{ marginBottom: '8px' }}>Вход для администратора</h2>
            <p className="text-14r" style={{ color: 'var(--gray)', marginBottom: '32px' }}>
              Этот номер привязан к аккаунту администратора. Введите пароль.
            </p>
            <div className="field" style={{ marginBottom: '24px' }}>
              <input
                type="password"
                className="field__input"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="field__label">Пароль</label>
            </div>
            {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
            <button type="submit" className="btn btn--green auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Проверка...' : 'Войти в панель'}
            </button>
          </form>
        )}

        {/* ШАГ 4: Профиль */}
        {step === 'profile' && (
          <form onSubmit={handleSaveProfile} className="auth-form">
            <h2 className="text-32b" style={{ marginBottom: '8px' }}>Добро пожаловать!</h2>
            <p className="text-14r" style={{ color: 'var(--gray)', marginBottom: '32px' }}>
              Похоже, вы у нас впервые. Расскажите немного о себе.
            </p>
            <div className="field" style={{ marginBottom: '20px' }}>
              <input
                type="text"
                className="field__input"
                placeholder=" "
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
              <label className="field__label">Ваше имя</label>
            </div>
            <div className="field" style={{ marginBottom: '32px' }}>
              <input
                type="email"
                className="field__input"
                placeholder=" "
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
              <label className="field__label">Email</label>
            </div>
            <button type="submit" className="btn btn--green auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Завершить'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}