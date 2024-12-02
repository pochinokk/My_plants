const axios = require("axios");
const { SERVER_URL } = require("../config/config");

const API_get = async (token, api_route, params) => {
    console.log("PARAMS:", params);
    try {
        const response = await axios.get(`${SERVER_URL}${api_route}`, {
            headers: {
                Authorization: `Bearer ${token || ''}`,
                'Content-Type': 'application/json'
            },
            params: params
        });
        return { response: response.data };
    }catch (e) {
        return {
            response: {
                message: e.response?.data?.message || 'Неизвестная ошибка',
            }
        };

    }
};
module.exports = API_get;



