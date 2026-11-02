import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/authPage.css';
import { useFavorites } from './component/FavoritesContext';


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
    // Оставляем только цифры
    let digits = value.replace(/\D/g, '');
    
    // Если пользователь стер всё, возвращаем базовый вид
    if (digits.length === 0) return '+7 ';

    // Если ввел 8 в начале, меняем на 7
    if (digits.startsWith('8')) {
      digits = '7' + digits.substring(1);
    }
    // Если не начинали с 7, добавляем её
    if (!digits.startsWith('7')) {
      digits = '7' + digits;
    }

    // Ограничиваем 11 цифрами (7 + 10 цифр номера)
    digits = digits.substring(0, 11);

    // Разбиваем на части через пробел
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

  // --- ШАГ 1: Отправка номера ---
  const handleSendCode = (e) => {
    e.preventDefault();
    // Проверяем, ввел ли пользователь все 11 цифр (с учетом 7)
    if (phone.replace(/\D/g, '').length < 11) {
      setError('Введите номер телефона полностью');
      return;
    }
    
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
      console.log('Тестовый СМС код: 1234');
    }, 1000);
  };

  // --- ШАГ 2: Проверка кода ---
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      if (code === '1234') {
        // 👇 Проверяем админа (номер теперь без скобок: +7 999 999 99 99)
        const isAdmin = phone === '+7 999 999 99 99';
        const isNewUser = !isAdmin;

        if (isAdmin) {
          setStep('admin_password');
        } else if (isNewUser) {
          setStep('profile');
        } else {
          alert('Вы успешно вошли!');
          navigate('/'); 
        }
      } else {
        setError('Неверный код. Попробуйте еще раз.');
      }
    }, 1000);
  };

  // --- ШАГ 3: Пароль Админа ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      if (password === 'admin123') {
        alert('Добро пожаловать в панель администратора!');
        navigate('/admin'); 
      } else {
        setError('Неверный пароль администратора.');
      }
    }, 1000);
  };

  // --- ШАГ 4: Профиль ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      const userProfile = {
        name: profileData.name || 'Имя не указано',
        school: 'Не указана', // если в форме нет школы, ставим заглушку
        phone: phone,
        email: profileData.email || 'Почта не указана'
      };
      localStorage.setItem('userProfile', JSON.stringify(userProfile));

      alert('Профиль создан! Добро пожаловать!');
      login();
      navigate('/profile'); // <--- Ведем сразу в личный кабинет
    }, 1000);
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        
        {/* ШАГ 1: Ввод телефона */}
        {step === 'phone' && (
          <form onSubmit={handleSendCode} className="auth-form">
            <h2 className="text-32b" style={{ marginBottom: '8px' }}>Вход или регистрация</h2>
            <p className="text-14r" style={{ color: 'var(--gray)', marginBottom: '32px' }}>
              Введите номер телефона. Для теста админа введите +7 999 999 99 99
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

        {/* ... (Остальные шаги без изменений) ... */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="auth-form">
            <button type="button" className="auth-back-btn" onClick={() => setStep('phone')}>
              &larr; Изменить номер
            </button>
            <h2 className="text-32b" style={{ marginBottom: '8px' }}>Введите код</h2>
            <p className="text-14r" style={{ color: 'var(--gray)', marginBottom: '32px' }}>
              Мы отправили код на номер {phone}
            </p>
            <div className="field" style={{ marginBottom: '24px' }}>
              <input type="text" className="field__input" placeholder=" " value={code} onChange={(e) => setCode(e.target.value)} maxLength="4" required />
              <label className="field__label">Код из СМС (попробуйте 1234)</label>
            </div>
            {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
            <button type="submit" className="btn btn--green auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Проверка...' : 'Далее'}
            </button>
          </form>
        )}

        {step === 'admin_password' && (
          <form onSubmit={handleAdminLogin} className="auth-form">
            <h2 className="text-32b" style={{ marginBottom: '8px' }}>Вход для администратора</h2>
            <p className="text-14r" style={{ color: 'var(--gray)', marginBottom: '32px' }}>
              Этот номер привязан к аккаунту администратора. Введите пароль.
            </p>
            <div className="field" style={{ marginBottom: '24px' }}>
              <input type="password" className="field__input" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label className="field__label">Пароль (попробуйте admin123)</label>
            </div>
            {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
            <button type="submit" className="btn btn--green auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Проверка...' : 'Войти в панель'}
            </button>
          </form>
        )}

        {step === 'profile' && (
          <form onSubmit={handleSaveProfile} className="auth-form">
            <h2 className="text-32b" style={{ marginBottom: '8px' }}>Добро пожаловать!</h2>
            <p className="text-14r" style={{ color: 'var(--gray)', marginBottom: '32px' }}>
              Похоже, вы у нас впервые. Расскажите немного о себе.
            </p>
            <div className="field" style={{ marginBottom: '20px' }}>
              <input type="text" className="field__input" placeholder=" " value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} required />
              <label className="field__label">Ваше имя</label>
            </div>
            <div className="field" style={{ marginBottom: '32px' }}>
              <input type="email" className="field__input" placeholder=" " value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} required />
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