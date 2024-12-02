const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const aboutUsRoutes = require('./routes/about_us');
const accountRoutes = require('./routes/account');
const authenticationRoutes = require('./routes/authentication');
const catalogRoutes = require('./routes/catalog');
const homeRoutes = require('./routes/home');
const order_creationRoutes = require('./routes/order_creation');
const plant_careRoutes = require('./routes/plant_care');
const registrationRoutes = require('./routes/registration');
const path = require("path");
const favicon = require('serve-favicon');
const jwt = require("jsonwebtoken");
const {secret} = require("./config/config");
const axios = require("axios");
const {SERVER_URL} = require("./config/config");

const PORT = process.env.PORT || 5000;

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));// статик
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(session({
    secret: 'really secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}));

app.use(aboutUsRoutes);
app.use(accountRoutes);
app.use(authenticationRoutes);
app.use(catalogRoutes);
app.use(homeRoutes);
app.use(order_creationRoutes);
app.use(plant_careRoutes);
app.use(registrationRoutes);

function start() {
    //Запуск сервера
    app.listen(PORT, () => {
        console.log('Client has been started');
    })
    axios.get(SERVER_URL)
        .then(response => {
            console.log('Сервер работает:', response.data);
        })
        .catch(error => {
            console.error('Ошибка подключения к серверу:', error.message);
        });
}
start();

