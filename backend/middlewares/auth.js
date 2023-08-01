const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  // получаем из заголовков запроса заголовок авторизации
  const { authorization } = req.headers;

  // если заголовок авторизации отсутствует
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // возвращаем ошибку: уведомляем пользователя о необходимости авторизоваться
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  // извлекаем из схемы аутентификации Bearer только токен
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // сравниваем текущий токен с токеном, выданным сервером пользователю при его авторизации
    // сохраняем данные аутентификации в payload токена
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // если не совпадают, то возвращаем ошибку:
    // уведомляем пользователя о необходимости авторизоваться
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  // добавляем в объект запроса данные об аутентификации пользователя
  req.user = payload;
  return next();
};

module.exports = auth;
