const {Router} = require('express');
const router = Router();
const renderPage = require("../utils/page_render");



router.get('/plant_care', async (req, res) => {
    await renderPage(req, res, 'plant_care_page', 'isPlantCare');
});
module.exports = router;