const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const savesRoutes = require('./routes/saves');
const deletesRoutes = require('./routes/deletes');
const getsRoutes = require('./routes/gets');
const authenticationRoutes = require('./routes/authentication');
const checkBlackListRoutes = require('./routes/check_black_list');
//Маршруты
const PORT = process.env.PORT || 3000;


const app = express();


app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));// статик

app.use(session({
    secret: 'really secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}));


app.use(checkBlackListRoutes);
app.use(savesRoutes);
app.use(deletesRoutes);
app.use(getsRoutes);
app.use(authenticationRoutes);

app.get('/', (req, res) => {
    console.log('Клиент запустился');
    res.status(200).json({ message: 'Сервер работает' });
});

async function start() {
    try{
        //Подключение к MongoDB
        await mongoose.connect(process.env.MONGODB_URI);//создайте свой файл .env и добавьте путь до вашей базы данных

        //Запуск сервера
        app.listen(PORT, () => {
            console.log('Server has been started on http://localhost:' + PORT)
        })

    } catch (e) {
        console.log(e)
    }
}



start()
