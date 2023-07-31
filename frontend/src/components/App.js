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
import AddCardPopup from "./AddCardPopup";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";

function App() {
  // статус регистрации/авторизации для InfoTooltip
  const [isSucceeded, setIsSucceeded] = useState(false);
  // состояние авторизации
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // попапы
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
  const [isPopupWithConfirmationOpen, setIsPopupWithConfirmationOpen] = useState(false);
  // пользователь
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  // карточки
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deletedCard, setDeletedCard] = useState(null);
  // меню (мобильная версия)
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
  // загрузка
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // отрисовка основной страницы
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    // если токен есть в локальном хранилище браузера, то отправляем его серверу на проверку
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            setCurrentUserEmail(res.email);
            // если токен успешно проходит проверку, пользователь авторизовывается и получает доступ к системе (защищенным маршрутам)
            setIsLoggedIn(true);
            // и перенаправляется на основную страницу /
            navigate("/", { replace: true });
          }
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
  }, [navigate]);

  // отрисовка данных пользователя и карточек
  useEffect(() => {
    // если пользователь авторизован, на основной странице отображаются данные пользователя и карточки
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards.reverse());
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
  }, [isLoggedIn]);

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setIsSucceeded(true);
          setIsInfoTooltipOpen(true);
          // пользователь перенаправляется на страницу авторизации (логина)
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
          // после успешной авторизации сервер присваивает пользователю токен
          // извлекаем токен из ответа сервера и сохраняем его в локальном хранилище браузера
          localStorage.setItem("jwt", res.token);
          setIsLoggedIn(true);
          // пользователь получает доступ к системе и перенаправляется на основную страницу /
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
    // при выходе из системы удаляем токен из локального хранилища браузера
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // пользователь перенаправляется на страницу авторизации (логина)
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

  function handleAddCardClick() {
    setIsAddCardPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddCardPopupOpen(false);
    setIsPopupWithConfirmationOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
    setDeletedCard(null);
  }

  function handleUpdateUserInfo(name, about) {
    api
      .updateUserInfo({ name, about })
      .then((user) => {
        setCurrentUser(user);
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
      .updateAvatar({ avatar })
      .then((user) => {
        setCurrentUser(user);
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

  function handleAddCard(name, link) {
    api
      .addCard({ name, link })
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

  function handleToggleLike(card) {
    // если id текущего пользователя совпадает с id пользователя в массиве лайков, то isLiked = true, иначе - false
    const isLiked = card.likes.some((userId) => userId === currentUser._id);

    api
      .toggleLike(card._id, isLiked)
      .then((card) => {
        setCards((cards) => cards.map((c) => (c._id === card._id ? card : c)));
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleConfirmationOpen(card) {
    setDeletedCard(card);
    setIsPopupWithConfirmationOpen(true);
  }

  function handleDeleteCard(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          loggedIn={isLoggedIn}
          onLogout={handleLogout}
          currentUserEmail={currentUserEmail}
          isMenuOpen={isMenuMobileOpen}
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
                    onAddCard={handleAddCardClick}
                    onCardClick={handleCardClick}
                    onToggleLike={handleToggleLike}
                    onConfirmDelete={handleConfirmationOpen}
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
          onUpdateInfo={handleUpdateUserInfo}
          isLoading={isLoading}
        />
        <AddCardPopup
          isOpen={isAddCardPopupOpen}
          onClose={closeAllPopups}
          onAddCard={handleAddCard}
          isLoading={isLoading}
        />
        <PopupWithConfirmation
          type="delete"
          card={deletedCard}
          isOpen={isPopupWithConfirmationOpen}
          onClose={closeAllPopups}
          onConfirm={handleDeleteCard}
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
