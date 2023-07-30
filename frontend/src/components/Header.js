import { Routes, Route, Link } from "react-router-dom";
import logo from "../images/logo.svg";
import menuButton from "../images/menu-icon.svg";
import closeButton from "../images/close-button.svg";
import MobileMenu from "./MobileMenu";

function Header({ loggedIn, onLogout, currentUserEmail, isOpen, onMenuClick }) {
  return (
    <>
      <MobileMenu
        currentUserEmail={currentUserEmail}
        onLogout={onLogout}
        isOpen={isOpen}
      />
      <header className="header">
        <img className="header__logo" src={logo} alt="Логотип Mesto"/>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <p className="header__email">{currentUserEmail}</p>
                <Link
                  className="header__link header__link_type_exit"
                  onClick={onLogout}
                >
                  Выйти
                </Link>
              </>
            }
          />
          <Route
            path="/sign-in"
            element={
              <Link className="header__link" to="/sign-up">
                Регистрация
              </Link>
            }
          />
          <Route
            path="/sign-up"
            element={
              <Link className="header__link" to="/sign-in">
                Войти
              </Link>
            }
          />
        </Routes>
        <div
          className="header__menu-button"
          style={{
            backgroundImage: isOpen
              ? `url(${closeButton})`
              : `url(${menuButton})`,
            display: !loggedIn ? "none" : "block",
          }}
          onClick={onMenuClick}
        ></div>
      </header>
    </>
  );
}

export default Header;
