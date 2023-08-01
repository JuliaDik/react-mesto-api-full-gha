class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // проверить ответ сервера
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // получить все данные пользователя
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  // обновить "имя" и "о себе" пользователя
  updateUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._checkResponse);
  }

  // обновить аватар пользователя
  updateAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._checkResponse);
  }

  // получить все карточки
  getCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  // добавить карточку
  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._checkResponse);
  }

  // удалить карточку по id
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  // поставить/убрать лайк (по id карточки)
  toggleLike(cardId, isLiked) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: !isLiked ? "PUT" : "DELETE",
      headers: this._headers,
    }).then(this._checkResponse);
  }
}

const api = new Api({
  baseUrl: "https://mesto.api.nomoredomains.sbs",
  headers: {
    // формат передачи данных в теле запроса/ответа - json
    "Content-Type": "application/json",
    // внутри запросов отправляется токен пользователя, выданный ему сервером при авторизации
    // токен хранится в локальном хранилище браузера
    // Bearer - имя схемы аутентификации; схема сообщает серверу, что проверять наличие прав у пользователя нужно по токену
    // только авторизованным пользователям предоставляется доступ к защищенным маршрутам
    // теперь пользователю не нужно вводить пароль при каждом посещении сайта
    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
  },
});

export default api;
