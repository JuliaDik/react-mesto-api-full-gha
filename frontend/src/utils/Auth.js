class Auth {
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

  // зарегистрировать пользователя
  register(email, password) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ email, password }),
    }).then(this._checkResponse);
  }

  // авторизовать пользователя (предоставить доступ к защищенным маршрутам)
  login(email, password) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ email, password }),
    }).then(this._checkResponse);
  }

  // проверить токен пользователя (чтобы решить, предоставлять ли доступ к защищенным маршрутам или нет)
  checkToken(jwt) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwt}`,
      },
    }).then(this._checkResponse);
  }
}

const auth = new Auth({
  // сервер принимает запросы на 3001 порт
  baseUrl: "http://localhost:3001",
  headers: {
    // формат передачи данных в теле запроса/ответа - json
    "Content-Type": "application/json",
  },
});

export default auth;
