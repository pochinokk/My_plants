const {Router} = require('express')
const router = Router()
const {checkAccess} = require('../middleware/access_middleware');
const {Types} = require("mongoose");
const positions = require("../positions/Positions");
const renderPage = require("../utils/page_render");
const API_get = require("../utils/API_get");
const API_post = require("../utils/API_post");

router.get('/account', checkAccess(['ADMIN', 'USER']), async (req, res) => {
    try{
        const mes = req.session.mes || null;
        const er = req.session.er || null;
        req.session.mes = null;
        req.session.er = null;
        const token = req.cookies.token;
        let {response} = await API_get(token, '/api/get_current_customer');
        if(!response.customer){

            return await renderPage(req, res, 'authentication_page', 'isAuthentication', {er: 'Ошибка авторизации'});

        }
        const customer = response.customer;
        if(customer.role === 'ADMIN') {
            return await renderPage(req, res, 'admin_page', 'isAccount', { mes, er });

        }

        ({ response } = await API_get(token, '/api/get_current_customer_orders'));

        if(response.message !== "Успешно"){
            return await renderPage(req, res, 'account_page', 'isAccount', { er: "Сервер ничего не отправил" });
        }
        const orders = response.orders;

        orders.forEach(order => {
            order.amount = order.products.reduce((sum, product) => {
                const position = positions.find(p => p.name === product.name);
                const price = position ? position.price : 0;
                return sum + (price * product.quantity);
            }, 0);

            order.product_set = order.products.map(product => {
                return `${product.name} ${product.quantity}шт.`;
            }).join(', ');
            delete order.products;
        });


        return await renderPage(req, res, 'account_page', 'isAccount', { mes, er, orders });
    } catch (e){
        console.log(e);
        req.session.er = 'Ошибка авторизации';
        return res.redirect('/authentication');

    }
});

router.post('/admin_save_order', checkAccess(['ADMIN']), async (req, res) => {
    try {
        const { username, str } = req.body;
        const token = req.cookies.token;
        const {response} = await API_post(token, '/api/admin_save_order', {username, str});
        if(response.message !== "Успешно"){
            req.session.er = response.message;
            return res.redirect('/account');
        }
        req.session.mes = 'Заказ успешно сохранён' ;
        return res.redirect('/account');

    } catch (e) {
        console.log(e);
        req.session.er = 'Ошибка авторизации';
        return res.redirect('/account');

    }
});


router.post('/admin_delete_order', checkAccess(['ADMIN']), async (req, res) => {
    try {
        const { id } = req.body;
        const token = req.cookies.token;
        const {response} = await API_post(token, '/api/admin_delete_order', {id});
        if(response.message !== "Успешно"){
            req.session.er = response.message;
            return res.redirect('/account');
        }
        req.session.mes = 'Заказ успешно удалён' ;
        return res.redirect('/account');

    } catch (e) {
        console.log(e);
        req.session.er = 'Ошибка авторизации';
        return res.redirect('/account');

    }
});

router.post('/admin_delete_customer', checkAccess(['ADMIN']), async (req, res) => {
    try {
        const { username } = req.body;
        const token = req.cookies.token;
        const {response} = await API_post(token, '/api/admin_delete_customer', {username});
        if(response.message !== "Успешно"){
            req.session.er = response.message;
            return res.redirect('/account');
        }
        req.session.mes = 'Пользователь успешно удалён' ;
        return res.redirect('/account');

    } catch (e) {
        console.log(e);
        req.session.er = 'Ошибка авторизации';
        return res.redirect('/account');

    }
});


router.get('/admin_get_all_customers', checkAccess(['ADMIN']), async (req, res) => {
    try {
        const token = req.cookies.token;
        const {response} = await API_get(token, '/api/admin_get_all_customers');
        const customers = response.customers;

        if(response.message !== "Успешно"){
            req.session.er = response.message;
            return res.redirect('/account');
        }
        return await renderPage(req, res, 'admin_page', 'isAccount', { customers });

    } catch (e) {
        console.log(e);
        req.session.er = 'Ошибка авторизации';
        return res.redirect('/account');

    }
});

router.get('/admin_get_all_orders', checkAccess(['ADMIN']), async (req, res) => {
    try {
        const token = req.cookies.token;
        const {response} = await API_get(token, '/api/admin_get_all_orders');
        const all_orders = response.all_orders;

        if(response.message !== "Успешно"){
            req.session.er = response.message;
            return res.redirect('/account');
        }
        return await renderPage(req, res, 'admin_page', 'isAccount', { all_orders });

    } catch (e) {
        console.log(e);
        req.session.er = 'Ошибка авторизации';
        return res.redirect('/account');

    }
});

router.get('/admin_get_customer_orders', checkAccess(['ADMIN']), async (req, res) => {
    try {
        const { username } = req.query;
        console.log(username);
        const token = req.cookies.token;
        const {response} = await API_get(token, '/api/admin_get_customer_orders', {username});
        if(response.message !== "Успешно"){
            req.session.er = response.message;
            return res.redirect('/account');
        }
        const orders = response.orders;

        return await renderPage(req, res, 'admin_page', 'isAccount', { orders });

    } catch (e) {
        console.log(e);
        req.session.er = 'Ошибка авторизации';
        return res.redirect('/account');

    }
});


module.exports = router;