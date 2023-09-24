const express = require('express');
const router = express.Router();
const devController = require('../controllers/dev')

router.post('/users', devController.create_users)
router.post('/waves', devController.create_waves)
router.get('/test', devController.test)


module.exports = router;