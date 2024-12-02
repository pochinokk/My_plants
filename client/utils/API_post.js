const axios = require("axios");
const { SERVER_URL } = require("../config/config");

const API_post = async (token, api_route, data) => {

    console.log("DATA:", data)
    console.log(`Bearer ${token || ''}`.trim()+'end');
    try {
        const response = await axios.post(`${SERVER_URL}${api_route}`, data, {
            headers: {
                Authorization: `Bearer ${token || ''}`.trim(),
                'Content-Type': 'application/json',
            },
        });
        return { response: response.data };
    } catch (e) {
        return {
            response: {
                message: e.response?.data?.message || 'Неизвестная ошибка',
            }
        };

    }

};

module.exports = API_post;


