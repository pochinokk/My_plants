const Router= require('express');
const bcrypt = require('bcryptjs');
const router = Router();
const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');
const {checkAccess} = require('../middleware/access_middleware');
const renderPage = require("../utils/page_render");
const API_get = require("../utils/API_get");
const API_post = require("../utils/API_post");





router.get('/authentication', async (req, res) => {
    const mes = req.session.mes || null;
    const er = req.session.er || null;
    req.session.mes = null;
    req.session.er = null;
    return await renderPage(req, res, 'authentication_page', 'isAuthentication', { mes, er });
});



router.post('/authenticate', async(req, res) => {
    try{

        const {username, password} = req.body;



        const {response} = await API_post(req.cookies.token, '/api/authenticate', {username, password});

        if(response.message !== "Успешно")
        {
            req.session.er = response.message;
            return res.redirect('/authentication');
        }

        res.clearCookie('token', {httpOnly: true }); // Очистка старого токена
        res.cookie('token', response.new_token, { httpOnly: true });


        req.session.mes = 'Вы успешно авторизовались';
        return res.redirect('/authentication');



    } catch(e){
        console.log(e);
        req.session.er = 'Ошибка авторизации';
        return res.redirect('/authentication');

    }
});

router.post('/logout', checkAccess(['ADMIN', 'USER']), async (req, res) => {
    try {
        const {response} = await API_post(req.cookies.token, '/api/logout');

        if(response.message !== "Успешно")
        {
            req.session.er = response.message;
            return res.redirect('/account');
        }
        res.clearCookie('token',  {httpOnly: true });

        return res.redirect('/home');

    } catch (e) {
        console.log(e);
        req.session.er = 'Ошибка при выходе из системы';
        return res.redirect('/account');

    }
});

module.exports = router;
