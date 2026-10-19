import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        
        <div className="header__left">
          <button className="header__burger btn btn--green btn--icon" title="Меню">
            <img src="/menu.svg" alt="Список вузов"/>
          </button>

          <a href="/" className="header__logo">
            <img src="/logo.svg" alt="Список вузов"/>
          </a>
        </div>

        <nav className="header__nav">
          <ul>
            <li>
              <a href="/" className="header__nav-link text-14m">Вузы России</a>
            </li>
            <li>
              <a href="/professions" className="header__nav-link text-14m">Профессии</a>
            </li>
            <li>
              <a href="/specialties" className="header__nav-link text-14m">Специальности</a>
            </li>
            <li>
              <a href="/ratings" className="header__nav-link text-14m">Рейтинги</a>
            </li>
          </ul>
        </nav>

        <div className="header__btn">
          <button className="btn btn--green btn--icon" title="Профиль">
            <img src="/person.svg" alt="Профиль" width="24" height="24" />
          </button>
          <button className="btn btn--green btn--icon" title="Избранное">
            <img src="/favorite.svg" alt="Избранное" width="24" height="24" />
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;