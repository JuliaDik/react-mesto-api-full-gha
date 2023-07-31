const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { URL_REGEX } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');

// маршрут регистрации
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_REGEX),
  }),
}), createUser);

// маршрут авторизации
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// маршрут пользователя с защитой авторизацией
router.use('/users', auth, usersRouter);

// маршрут карточек с защитой авторизацией
router.use('/cards', auth, cardsRouter);

// несуществующий маршрут
router.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый роут не найден'));
});

module.exports = router;
