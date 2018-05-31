const express   = require('express');
const router    = express.Router();
const paginate  = require('paginate/paginate');
const IndexController = require('controllers/IndexController');

router.use(paginate.middleware(10, 100));

router.get('/', IndexController.index);

router.get('/view/:id/:searchId', IndexController.view);

module.exports = router;
