const express = require('express');
const router = express.Router();
const wave = require('../controllers/wave')

// todo: melhorar os routes do wave

router.get('/', wave.get)
router.get('/:id', wave.get)
router.post('/', wave.post)
router.put('/:id', wave.editar)
router.delete('/:id', wave.delete)

router.post('/:id/associar', wave.associar)

module.exports = router;