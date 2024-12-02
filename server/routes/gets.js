const {Router} = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const positions = require('../models/positions');
const {checkAccess} = require('../middleware/access_middleware');
const express = require("express");
router.use(express.json());

router.get('/api/get_current_customer', async (req, res) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Токен не предоставлен или неверный формат' });
        }
        const token = authHeader.split(' ')[1];
        console.log(`ПЕРЕД декодированием токен:${token}`);
        let decoded;
        try {
            decoded = jwt.verify(token, secret);

        } catch (e) {
            console.log(e);
            return res.status(401).json({ message: 'Токен недействителен или истек' });
        }
        const { id } = decoded;
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        return res.status(200).json({ message: 'Успешно', customer });
    } catch (error) {
        console.error('Ошибка получения текущего пользователя:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

router.get('/api/get_current_customer_orders', checkAccess(['ADMIN', 'USER']), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const {id, role: customer_role} = jwt.verify(token, secret);
    const orders = await Order.find({customer_id: id}).lean();
    console.log(orders);
    return res.status(200).json({ message: 'Успешно', orders });
});

router.get('/api/admin_get_all_customers', checkAccess(['ADMIN']), async (req, res) => {
    console.log("Админ получает всех пользователей");
    const customers = await Customer.find().lean();
    console.log(customers);
    return res.status(200).json({ message: 'Успешно', customers });
});
router.get('/api/admin_get_all_orders', checkAccess(['ADMIN']), async (req, res) => {
    console.log("Админ получает все заказы");
    const all_orders = await Order.find().lean();

    for (const order of all_orders) {
        order.amount = order.products.reduce((sum, product) => {
            const position = positions.find(p => p.name === product.name);
            const price = position ? position.price : 0;
            return sum + (price * product.quantity);
        }, 0);

        order.product_set = order.products.map(product => {
            return `${product.name} ${product.quantity}шт.`;
        }).join(', ');

        const customer = await Customer.findOne({ _id: order.customer_id });
        order.username = customer ? customer.username : 'Неизвестный пользователь';

        delete order.products;
    }
    console.log(all_orders);
    return res.status(200).json({ message: 'Успешно', all_orders });
});

router.get('/api/admin_get_customer_orders', checkAccess(['ADMIN']), async (req, res) => {
    try{
        console.log("Админ получает заказы пользователя");
        console.log(req.url);
        const { username } = req.query; // Получение параметра из строки запроса
        console.log("ИМЯ ПОЛЬЗОВАТЕЛЯ:", username);
        if (!username || username === '') {

            return res.status(400).json({ message: 'Не получено имя пользователя для поиска' });
        }
        const customer = await Customer.findOne({username});
        if(!customer){

            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        const orders = await Order.find({ customer_id: customer._id }).lean();
        if (!orders || orders.length === 0) {
            return res.status(400).json({ message: 'У данного пользователя нет заказов' });
        }



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
        console.log(orders);

        return res.status(200).json({ orders, message: 'Успешно' });
    } catch (e){

        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});


module.exports = router;



