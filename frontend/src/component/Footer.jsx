function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <a href="/">
                    <img
                        src="./logo.svg"
                        alt="Список вузов"
                    />
                </a>
                <nav className="footer__nav">
                    <ul>
                        <li>
                            <a href="/" className="footer__nav-link text-14m">Вузы России</a>
                        </li>
                        <li>
                            <a href="/professions" className="footer__nav-link text-14m">Профессии</a>
                        </li>
                        <li>
                            <a href="/specialties" className="footer__nav-link text-14m">Специальности</a>
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