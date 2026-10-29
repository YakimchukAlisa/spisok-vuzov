import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <a href="/">
                    <img
                        src="/logo.svg"
                        alt="Список вузов"
                    />
                </a>
                <nav className="footer__nav">
                    <ul>
                        <li>
                            <a href="/" className="footer__nav-link text-14m">Вузы России</a>
                        </li>
                        <li>
                            <Link to="/professions" className="footer__nav-link text-14m">Профессии</Link>
                        </li>
                        <li>
                            <Link to="/specialties" className="footer__nav-link text-14m">Специальности</Link>
                        </li>
                        <li>
                            <a href="/ratings" className="footer__nav-link text-14m">Рейтинги</a>
                        </li>
                    </ul>
                </nav>

            </div>
        </footer>
    )
}

export default Footer;