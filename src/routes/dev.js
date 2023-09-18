const express = require('express');
const router = express.Router();
const devController = require('../controllers/dev')

router.post('/users', devController.create_users)
router.get('/test', devController.test)


module.exports = router;