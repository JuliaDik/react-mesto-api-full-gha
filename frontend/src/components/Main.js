import React from "react";
import Card from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile" aria-label="профиль пользователя">
        <div className="profile__avatar-container">
          <img
            className="profile__avatar-image"
            src={currentUser.avatar}
            alt="Аватар пользователя"
          />
          <div className="profile__avatar-edit" onClick={onEditAvatar}></div>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            className="profile__edit-button"
            type="button"
            aria-label="кнопка-редактировать"
            title="Редактировать"
            onClick={onEditProfile}
          ></button>
          <p className="profile__about">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          type="button"
          aria-label="кнопка-добавить"
          title="Добавить карточку"
          onClick={onAddPlace}
        ></button>
      </section>
      <section className="gallery" aria-label="карточки с фотографиями">
        <ul className="cards-container">
          {cards.map((card) => (
            <Card
              card={card}
              key={card._id}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
