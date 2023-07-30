import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/Api";
import auth from "../utils/Auth";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import Login from "./Login";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithConfirmation from "./PopupWithConfirmation";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";

function App() {
  // аутентификация
  const [isSucceeded, setIsSucceeded] = useState(false);
  // авторизация
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // попапы
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isPopupWithConfirmationOpen, setIsPopupWithConfirmationOpen] =
    useState(false);
  // пользователь
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  // карточки
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardId, setCardId] = useState(null);
  // меню (мобильная версия)
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
  // загрузка
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getCards()])
        .then(([userData, cards]) => {
          setCurrentUser(userData);
          setCards(cards);
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            // при повторном визите на сайт
            // пользователь не должен вновь авторизовываться
            setCurrentUserEmail(res.data.email);
            setIsLoggedIn(true);
            // сразу перенаправляется в пользовательский профиль
            navigate("/", { replace: true });
          }
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
  }, []);

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setIsSucceeded(true);
          setIsInfoTooltipOpen(true);
          // перенаправляем на авторизацию (вход в систему)
          navigate("/sign-in", { replace: true });
        }
      })
      .catch((err) => {
        setIsSucceeded(false);
        setIsInfoTooltipOpen(true);
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleLogin(email, password) {
    auth
      .login(email, password)
      .then((res) => {
        if (res) {
          // сохраняем токен
          localStorage.setItem("jwt", res.token);
          setIsLoggedIn(true);
          // перенаправляем в пользовательский профиль
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        setIsSucceeded(false);
        setIsInfoTooltipOpen(true);
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleLogout() {
    // удаляем токен
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // перенаправляем на авторизацию (вход в систему)
    navigate("/sign-in", { replace: true });
    handleMenuMobileOpen();
  }

  function handleMenuMobileOpen() {
    setIsMenuMobileOpen(!isMenuMobileOpen);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsPopupWithConfirmationOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  }

  function handleUpdateUser(name, about) {
    api
      .patchUserInfo({ name, about })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setIsLoading(true);
  }

  function handleUpdateAvatar(avatar) {
    api
      .patchAvatar({ avatar })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setIsLoading(true);
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .postCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setIsLoading(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleConfirmDelete() {
    api
      .deleteCard(cardId)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== cardId));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleCardDeleteClick(cardId) {
    setCardId(cardId);
    setIsPopupWithConfirmationOpen(true);
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          loggedIn={isLoggedIn}
          onLogout={handleLogout}
          currentUserEmail={currentUserEmail}
          isOpen={isMenuMobileOpen}
          onMenuClick={handleMenuMobileOpen}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute loggedIn={isLoggedIn}>
                <>
                  <Main
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDeleteClick}
                    cards={cards}
                  />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegister} />}
          />
          <Route
            path="/sign-in"
            element={<Login onLogin={handleLogin} />}
          />
        </Routes>
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />
        <PopupWithConfirmation
          type="delete"
          card={selectedCard}
          isOpen={isPopupWithConfirmationOpen}
          onClose={closeAllPopups}
          onConfirm={handleConfirmDelete}
          isLoading={isLoading}
        />
        <ImagePopup
          type="image"
          card={selectedCard}
          onClose={closeAllPopups}
        />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSucceeded={isSucceeded}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
