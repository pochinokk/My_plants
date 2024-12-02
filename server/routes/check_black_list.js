const {Router} = require('express');
const router = Router();
const {checkAccess} = require('../middleware/access_middleware');
const jwt_black_list = require('../middleware/jwt_black_list');
const {secret}  = require('../config/config');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const express = require("express");
router.use(express.json());

router.get('/api/check_black_list', checkAccess(['ADMIN', 'USER']), async (req, res) => {
    console.log('ЗАШЛИ В check black list');
    try {
        const authHeader = req.headers.authorization;
        console.log("authHeader", authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'false', role: null });
        }
        console.log("После authHeader", authHeader);
        const token = authHeader.split(' ')[1];

        if (jwt_black_list.includes(token)) {
            return res.status(401).json({ message: 'false', role: null });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, secret);
        } catch (e) {
            return res.status(401).json({ message: 'false', role: null });
        }

        const { id } = decoded;

        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'false', role: null });
        }

        return res.status(200).json({ message: 'Успешно', role: customer.role });
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        return res.status(500).json({ message: 'false', role: null });
    }
});
module.exports = router;