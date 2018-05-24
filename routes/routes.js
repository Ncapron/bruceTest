const express   = require('express');
const router    = express.Router();

const IndexController = require('controllers/IndexController');

router.get('/', IndexController.index);

router.get('/api', IndexController.api);

router.post('/check', IndexController.check);

router.get('/search', IndexController.search);

router.get('/learn', IndexController.learn);

router.get('/view/:searchId/:jobId', IndexController.view);

module.exports = router;
