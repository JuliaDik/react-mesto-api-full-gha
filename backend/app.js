require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const router = require('./routes/index');

const { PORT = 3000, URL_DB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

// запускаем серверное приложение
const app = express();

// подключаемся к БД
mongoose.connect(URL_DB, {
  useNewUrlParser: true,
});

// ограничиваем количество запросов на сервер
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// собираем поток запросов в req.body в формате json
app.use(bodyParser.json());

// собираем поток запросов в req.body в формате URL-кодированных данных
app.use(bodyParser.urlencoded({ extended: true }));

// настраиваем кросс-доменные запросы
app.use(cors);

// обеспечиваем валидацию ввода данных пользователем перед тем, как сохранять их в БД
app.use(errors());

// обрабатываем ошибки централизованно
app.use(errorHandler);

// записываем все поступающие запросы в отдельный файл ("журнал запросов")
app.use(requestLogger);

// краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// подключаем маршруты запросов
app.use(router);

// записываем все возникающие ошибки в отдельный файл ("журнал ошибок")
app.use(errorLogger);

// сервер обрабатывает запросы и отправляет ответы через 3000 порт
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
