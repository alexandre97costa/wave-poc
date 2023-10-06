const express = require('express');
const router = express.Router();
const devController = require('../controllers/dev')
const u = require('../controllers/user')

router.post('/users', devController.create_users)
router.post('/waves', devController.create_waves)
router.get('/test', devController.test_login)

router.get('/supabase_signup', u.supabase_signup)


module.exports = router;