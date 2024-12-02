const jwt = require("jsonwebtoken");
const {secret} = require("../config/config");
const fs = require("fs");
const path = require("path");
const black_list_file = path.join(__dirname, "jwt_black_list.json");
const renderPage = require("../utils/page_render");
const API_get = require("../utils/API_get");

function checkAccess(roles){
    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req.cookies.token;
            if (!token) {
                req.session.mes = 'Авторизуйтесь для входа в личный кабинет';
                return res.redirect('/authentication');
            }
            const { response } = await API_get(token, '/api/check_black_list');//true - доступ дан, false - отказ
            if(response.message !== "Успешно")
            {
                console.log(`Кто-то с токеном ${token} из black list пытался что-то сделать`);
                req.session.er = "Токен был аннулирован";
                return res.redirect('/authentication');
            }
            if (!roles.includes(response.role)) {
                req.session.er = 'У вас нет доступа к этой странице. Авторизуйтесь для входа';
                return res.redirect('/authentication');
            }
            next();
        } catch (e) {
            console.log(e)
            return await renderPage(req, res, 'authentication_page', 'isAuthentication', {mes: 'Авторизуйтесь'});
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}
module.exports = { checkAccess };

