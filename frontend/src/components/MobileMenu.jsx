import { Routes, Route, Link } from "react-router-dom";

function MobileMenu({ currentUserEmail, onLogout, isOpen }) {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className={`menu-mobile ${isOpen && "menu-mobile_opened"}`}>
            <p className="menu-mobile__email">{currentUserEmail}</p>
            <Link className="menu-mobile__link" onClick={onLogout}>
              Выйти
            </Link>
          </div>
        }
      />
    </Routes>
  );
}

export default MobileMenu;
