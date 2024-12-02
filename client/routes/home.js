const {Router} = require('express')
const router = Router()

const renderPage = require('../utils/page_render');

router.get(['/', '/home'], async (req, res) => {
    return await renderPage(req, res, 'index', 'isIndex');
});

module.exports = router;