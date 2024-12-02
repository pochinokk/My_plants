const {Router} = require('express');
const router = Router();
const renderPage = require('../utils/page_render');

router.get('/about_us', async (req, res) => {
    return await renderPage(req, res, 'about_us_page', 'isAboutUs');
});

module.exports = router;