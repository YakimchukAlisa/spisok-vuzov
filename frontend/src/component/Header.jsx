import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from './FavoritesContext.jsx';

function Header() {
  const { isAuth } = useFavorites();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Функция для закрытия меню
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="header">
      <div className="header__container">

        <div className="header__left">
          <button 
            className="header__burger btn btn--green btn--icon" 
            title="Меню"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <img 
              src={isMobileMenuOpen ? "/close.svg" : "/menu.svg"} 
              alt="Меню" 
            />
          </button>

          <Link to="/" className="header__logo" onClick={closeMenu}>
            <img src="/logo.svg" alt="Список вузов" />
          </Link>
        </div>

        <nav className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}>
          <ul>
            <li>
              <Link to="/" className="header__nav-link text-14m" onClick={closeMenu}>Вузы России</Link>
            </li>
            <li>
              <Link to="/professions" className="header__nav-link text-14m" onClick={closeMenu}>Профессии</Link>
            </li>
            <li>
              <Link to="/specialties" className="header__nav-link text-14m" onClick={closeMenu}>Специальности</Link>
            </li>
            <li>
              <Link to="/ratings" className="header__nav-link text-14m" onClick={closeMenu}>Рейтинги</Link>
            </li>
          </ul>
        </nav>

        <div className="header__btn">
          {/* Кнопка профиля */}
          <Link 
            to={isAuth ? "/profile" : "/auth"} 
            className="btn btn--green btn--icon" 
            title={isAuth ? "Личный кабинет" : "Войти"}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill={isAuth ? "var(--white)" : "none"} 
              stroke="var(--white)" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          {/* Кнопка избранного */}
          {isAuth ? (
            <Link to="/favorites" className="btn btn--green btn--icon" title="Избранное">
              <img src="/favorite.svg" alt="Избранное" width="24" height="24" />
            </Link>
          ) : (
            <button
              className="btn btn--gray-light btn--icon"
              title="Войдите, чтобы просмотреть избранное"
              style={{ cursor: 'not-allowed' }}
            >
              <img
                src="/favorite.svg"
                alt="Избранное"
                width="24"
                height="24"
                style={{ opacity: 0.5 }}
              />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;