import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./css/adminLayout.css";

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header__left">
          <span className="admin-header__logo">Панель администратора</span>
        </div>

        <nav className="admin-header__nav">
          <NavLink
            to="/admin/universities"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Вузы
          </NavLink>
          <NavLink to="/" className="admin-header__to-site">
            На основной сайт
          </NavLink>
          <button className="admin-header__logout" onClick={handleLogout}>
            Выйти
          </button>
        </nav>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>

      <footer className="admin-footer">
        <span>Админ-панель · Список вузов</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}