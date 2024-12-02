const {Router} = require('express');
const router = Router();
const {checkAccess} = require('../middleware/access_middleware');
const {Types} = require("mongoose");
const express = require("express");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
router.use(express.json());

router.post('/api/admin_delete_order', checkAccess(['ADMIN']), async (req, res) => {
    try {
        const { id } = req.body;  // Получаем id из query-параметров
        console.log("Админ удаляет заказ")
        console.log(id);

        if (!id) {
            return res.status(400).json({ message: 'Не введён ID для удаления' });

        }

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Неверный формат ID' });

        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(400).json({ message: 'Заказ не найден' });

        }

        await Order.deleteOne({ _id: id });
        // Успешное удаление
        console.log("Заказ удален:", id);
        return res.json({ message: 'Успешно' });


    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });

    }
});


router.post('/api/admin_delete_customer', checkAccess(['ADMIN']), async (req, res) => {
    try {
        const { username } = req.body;
        console.log(username);
        console.log("Админ удаляет пользователя")
        if (!username) {

            return res.status(400).json({ message: 'Нужен пользователь для удаления' });
        }

        const customer = await Customer.findOne({username});
        if(!customer){

            return res.status(400).json({ message: 'Пользователь не найден' });
        }
        if(customer.role === 'ADMIN') {

            return res.status(400).json({ message: 'Удалять администраторов можно только в самой базе данных' });
        }

        await Order.deleteMany({ customer_id: customer._id });
        await Customer.deleteOne({username});

        // Успешное удаление
        console.log(`Пользователь ${username} успешно удален`);
        return res.json({ message: 'Успешно' });

    } catch (e) {
        console.log(e);

        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

module.exports = router;