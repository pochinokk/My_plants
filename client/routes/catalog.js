const {Router} = require('express')
const router = Router()
const renderPage = require("../utils/page_render");



router.get('/catalog', async (req, res) => {
    return await renderPage(req, res, 'catalog_page', 'isCatalog');
});

module.exports = router;