const express = require('express');
const router = express.Router();
const wave = require('../controllers/wave')

router.get('/', wave.get)
router.get('/:id', wave.get)
router.post('/', wave.post)
router.put('/:id', wave.editar)
router.patch('/:id/agente/:agente_id', wave.mudar_agente)
router.patch('/:id/estado/:novo_estado', wave.mudar_estado)
router.delete('/:id', wave.delete)

// os tipos estao no routes/tipos

router.get('/:id/comentarios_avaliacoes', wave.comentarios_avaliacoes)
router.post('/:id/comentario_avaliacao', wave.post_comentario_avaliacao)

router.post('/:id/associar', wave.associar)

router.get('/test_aval', wave.test_aval)
router.get('/test_img', wave.test_img)
router.get('/test_ppi', wave.test_ppi)

module.exports = router;