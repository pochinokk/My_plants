const {Router} = require('express');
const router = Router();
const {checkAccess} = require('../middleware/access_middleware');
const positions = require('../models/positions');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');
const bcrypt = require("bcryptjs");
const express = require("express");
router.use(express.json());

router.post('/api/register', async (req, res) => {
    try {
        console.log("РЕГИСТРАЦИЯ");
        const { username, password, full_name, phone, address} = req.body;
        const candidate = await Customer.findOne({username});
        if (candidate){
            return res.status(400).json({message: 'Пользователь с таким именем уже существует'});
        }
        const hashPassword = bcrypt.hashSync(password, 8);

        const customer = new Customer({username,
            password: hashPassword,
            full_name, phone,
            address,
            role: "USER" });
        await customer.save();
        return res.status(200).json({ message: 'Успешно'});
    } catch (e){
        console.log(e);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

router.post('/api/admin_save_order', checkAccess(['ADMIN']), async (req, res) => {
    try {
        const { username, str } = req.body;
        console.log("Админ сохраняет заказ:", req.body);
        if(!username || !str || username === '' || str === '') {
            return res.status(401).json({message: 'Некорректные данные'});
        }

        console.log(str);

        const items = str.split(', ').map(item => item.trim());
        const products = [];

        for (const item of items) {
            const [name, quantityStr] = item.split('_');
            const plant = positions.find(position => position.name === name);
            if (!plant) {
                return res.status(400).json({message: `Растение \'${name}\' не найдено`});

            }
            const quantity = parseInt(quantityStr);
            if (isNaN(quantity) || quantity <= 0 || quantity >= 11) {
                return res.status(400).json({message: `Количество одного вида растений может быть от 1 до 10. Некорректное количество для \'${name}\'`});

            }
            products.push({ name, quantity });
        }

        console.log('Parsed products:', products);
        const customer = await Customer.findOne({username});
        if(!customer){
            return res.status(400).json({message: 'Пользователь не найден'});

        }

        await Order.create({ customer_id: customer._id, products });
        return res.status(200).json({ message: 'Успешно'});


    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

router.post('/api/save_order', checkAccess(['ADMIN', 'USER']), async (req, res) => {
    try {
        const { str } = req.body;
        console.log("СОХРАНЕНИЕ ЗАКАЗА:", str);
        if (!str) {

            return res.status(400).json({ message: 'Неполная информация: отсутствует str' });
        }
        const items = str.split(', ').map(item => item.trim());
        const products = [];

        for (const item of items) {
            const [name, quantityStr] = item.split('_');
            const plant = positions.find(position => position.name === name);
            if (!plant) {

                return res.status(400).json({ message: `Растение \'${name}\' не найдено в базе` });
            }
            const quantity = parseInt(quantityStr);
            if (isNaN(quantity) || quantity <= 0 || quantity >= 11) {

                return res.status(400).json({ message: `Некорректное количество для "${name}".` });
            }
            products.push({ name, quantity });
        }

        console.log('Parsed products:', products);
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        const { id } = decoded;
        console.log("ID покупателя:" + id);

        await Order.create({ customer_id: id, products });

        return res.status(200).json({ message: 'Успешно'});
    } catch (e) {

        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }

});

module.exports = router;