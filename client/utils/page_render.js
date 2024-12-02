const axios = require("axios");
const { SERVER_URL } = require("../config/config");
const API_get = require("./API_get");

const renderPage = async (req, res, page, flag, additionalData) => {
    const renderData = { [flag]: true, username: 'Вы не авторизованы', ...additionalData };
    const token = req.cookies.token;

    if (token) {
        const { response} = await API_get(req.cookies.token, '/api/get_current_customer');
        if (response.message === 'Успешно' && response.customer) {
            renderData.username = response.customer.username;
        }
    }
    return res.render(page, renderData);
};

module.exports = renderPage;