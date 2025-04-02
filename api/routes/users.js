const express = require('express');
const router = express.Router();
const userService = require('../services/users');
const private = require('../middlewares/private');

// Routes API pour les utilisateurs
router.get('/', private.checkJWT, userService.getAll);
router.get('/:email', private.checkJWT, userService.getByEmail);
router.post('/', userService.add);
router.put('/:email', private.checkJWT, userService.update);
router.delete('/:email', private.checkJWT, userService.delete);
router.post('/authenticate', userService.authenticate);

module.exports = router;