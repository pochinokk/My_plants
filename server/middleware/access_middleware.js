const jwt = require("jsonwebtoken");
const {secret} = require("../config/config");
const fs = require("fs");
const path = require("path");
const black_list_file = path.join(__dirname, "jwt_black_list.json");
const Customer = require("../models/Customer");
let jwt_black_list = [];


function loadBlackList() {
    try {
        if (fs.existsSync(black_list_file)) {
            const data = fs.readFileSync(black_list_file, "utf-8");
            jwt_black_list = JSON.parse(data);
            console.log("Черный список загружен из файла");
        }
    } catch (err) {
        console.error("Ошибка при загрузке черного списка:", err);
    }
}

function saveBlackList() {
    try {
        const data = JSON.stringify(jwt_black_list, null, 2);
        fs.writeFileSync(black_list_file, data, "utf-8");
        console.log("Черный список сохранен в файл");
    } catch (err) {
        console.error("Ошибка при сохранении черного списка:", err);
    }
}

function addToBlackList(token, life_time) {
    const delete_time = Date.now() + life_time;
    jwt_black_list.push({ token, delete_time });
}


function cleanBlackList() {
    console.log(jwt_black_list)
    const now = Date.now();
    const list_length = jwt_black_list.length;
    jwt_black_list = jwt_black_list.filter(item => item.delete_time > now);
    if(list_length !== jwt_black_list.length)
    {
        console.log("Черный список JWT подчищен");
    }
    console.log(`Количество токенов в списке:${jwt_black_list.length}`);
}

function checkAccess(roles){
    return async function (req, res, next) {

        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const authHeader = req.headers.authorization;
            console.log("authHeader", authHeader);
            if (!authHeader || !authHeader.startsWith('Bearer')) {
                return res.status(401).json({ message: 'false', role: null });
            }
            console.log("После authHeader", authHeader);
            const token = authHeader.split(' ')[1];

            if (!token) {
                console.log('Токена нет');
                return res.status(403).json({message: "Пользователь не авторизован"});
            }

            if (jwt_black_list.find(item => item.token === token)) {
                console.log(`Кто-то с токеном ${token} из black list пытался что-то сделать`);
                return res.status(403).json({message: "Токен был аннулирован"});
            }


            const {id, role: customer_role} = jwt.verify(token, secret);

            if (!roles.includes(customer_role)) {

                return res.status(403).json({message: "У вас нет доступа"})
            }

            const customer = await Customer.findOne({_id: id});
            if (!customer) {

                return res.status(500).json({message: "Произошла какая-то ошибка"})
            }
            next();
        } catch (e) {
            console.log(e)

            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}
loadBlackList();
cleanBlackList();
const intervalId = setInterval(cleanBlackList,   5 * 60 * 1000);


process.on('SIGINT', () => {
    clearInterval(intervalId);
    console.log("Сохранение черного списка...");
    saveBlackList();
    process.exit();
});


process.on('SIGTERM', () => {
    clearInterval(intervalId);
    console.log("Сохранение черного списка...");
    saveBlackList();
    process.exit();

});

module.exports = {checkAccess, addToBlackList};