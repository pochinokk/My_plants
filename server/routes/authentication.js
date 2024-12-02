const {Router} = require('express');
const router = Router();
const {checkAccess, addToBlackList} = require('../middleware/access_middleware');
const Customer = require('../models/Customer');
const TOKEN_LIFE_TIME = 15 * 60 * 1000;
const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');
const express = require('express');
const bcrypt = require('bcryptjs');

router.use(express.json());

const generateAccessToken = (id, role) => {
    const payload = {id, role}
    return jwt.sign(payload, secret, { expiresIn: '15m' });//Должно совпадать с TOKEN_LIFE_TIME
}

router.post('/api/authenticate', async(req, res) => {
    try{
        const {username, password} = req.body;
        console.log("Пользователь авторизуется:", req.body);
        if(!username || !password || username === '' || password === '') {
            return res.status(401).json({message: 'Некорректные данные'});
        }

        const customer = await Customer.findOne({username});
        if (!customer){
            return res.status(401).json({message: `Пользователь ${username} не найден`});
        }

        const validPassword = bcrypt.compareSync(password, customer.password);
        if (!validPassword){
            return res.status(401).json({message: `Введен неверный пароль`});
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            console.log('Я здесь');
            return res.status(401).json({ message: 'Токен не предоставлен или неверный формат' });
        }
        const token = authHeader.split(' ')[1];
        console.log(token);

        if (token !== undefined && token !== '' && token !== null) {
            console.log("token равен:", token);
            console.log("Добавляем его в блэк лист");
            addToBlackList(token, TOKEN_LIFE_TIME);
        }

        const new_token = generateAccessToken(customer._id, customer.role);
        return res.status(200).json({ message: 'Успешно', new_token});



    } catch(e){
        console.log(e);
    }
});


router.post('/api/logout', checkAccess(['ADMIN', 'USER']), async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        console.log("ЛОГАУТ:",token);
        const {id, role: customer_role} = jwt.verify(token, secret);
        if (token !== undefined && token !== '' && token !== null){
            addToBlackList(token, TOKEN_LIFE_TIME);
        }
        return res.status(200).json({ message: 'Успешно'});


});
module.exports = router;