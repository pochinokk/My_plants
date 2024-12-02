const {Router} = require('express');
const router = Router();
const renderPage = require("../utils/page_render");
const { checkAccess } = require("../middleware/access_middleware");
const positions = require("../positions/Positions");
const jwt = require("jsonwebtoken");
const {secret} = require("../config/config");
const API_post = require("../utils/API_post");

router.get('/order_creation', checkAccess(['ADMIN', 'USER']), async (req, res) => {

    const sortType = req.query.sort_type;
    const mes = req.session.mes || null;
    const er = req.session.er || null;
    req.session.mes = null;
    req.session.er = null;

    if(!sortType){
        return await renderPage(req, res, 'order_creation_page', 'isOrderCreation', { positions,  mes, er});
    }
    let sortedPositions = [...positions];

    if (sortType === 'ascending') {
        sortedPositions.sort((a, b) => a.price - b.price);
    } else if (sortType === 'descending') {
        sortedPositions.sort((a, b) => b.price - a.price);
    } else if (sortType === 'name') {
        sortedPositions.sort((a, b) => a.name.localeCompare(b.name)); // По алфавиту
    }
    return await renderPage(req, res, 'order_creation_page', 'isOrderCreation', { positions: sortedPositions, mes, er});
});


router.post('/save_order', checkAccess(['ADMIN', 'USER']), async (req, res) => {
    try {
        const { str } = req.body;
        const token = req.cookies.token;
        const {response} = await API_post(token, '/api/save_order', { str });
        if(response.message !== "Успешно"){
            req.session.er = response.message;
            return res.redirect('/account');
        }

        req.session.mes = 'Заказ успешно сохранён';
        return res.redirect('/order_creation');

    } catch (e) {
        console.error('Ошибка сохранения заказа:', e);
        req.session.er = 'Ошибка авторизации';
        return res.redirect('/account');
    }
});


module.exports = router;