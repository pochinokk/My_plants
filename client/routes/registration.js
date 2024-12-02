const Router = require('express');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const renderPage = require("../utils/page_render");
const API_get = require("../utils/API_get");
const API_post = require("../utils/API_post");
const router = Router();

// Страница регистрации
router.get('/registration', async (req, res) => {
    const mes = req.session.mes || null;
    const er = req.session.er || null;
    const valid_ers = req.session.valid_ers || null;
    req.session.mes = null;
    req.session.er = null;
    req.session.valid_ers = null;
    return await renderPage(req, res, 'registration_page', 'isAuthentication', { mes, er, validationErrors: valid_ers });
});


router.post('/register',
    [
    check('username', "Логин не может быть пустым").not().isEmpty(),
    check('password', "Пароль должен быть больше или равен 4 символам").isLength({min: 4}),
    check('full_name', "Имя пользователя не может быть пустым").not().isEmpty(),
    check('phone', "Телефон не может быть пустым").not().isEmpty(),
    check('address', "Адрес не может быть пустым").not().isEmpty(),
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.valid_ers = errors.array().map(error => error.msg);
            return res.redirect('/registration');
        }
        const token = req.cookies.token;
        const { username, password, full_name, phone, address} = req.body;
        const {response} = await API_post(token, '/api/register', { username, password, full_name, phone, address});
        if(response.message !== "Успешно"){
            req.session.er = response.message;
            return res.redirect('/registration');
        }
        req.session.mes = 'Вы успешно зарегистрировались. Теперь вы можете авторизоваться';
        return res.redirect('/authentication');
    } catch(e){
        console.log(e);
        req.session.er = 'Ошибка авторизации';
        return res.redirect('/authentication');
    }
});

module.exports = router;
