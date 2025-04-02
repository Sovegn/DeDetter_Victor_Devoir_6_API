const express = require('express');
const router = express.Router();
const catwayService = require('../services/catways');
const reservationService = require('../services/reservations');
const private = require('../middlewares/private');

// Catway routes
router.get('/', catwayService.getAll);
router.get('/:id', catwayService.getById);
router.post('/', private.checkJWT, catwayService.create);
router.put('/:id', private.checkJWT, catwayService.update);
router.delete('/:id', private.checkJWT, catwayService.delete);

// Reservation subroutes
router.get('/:id/reservations', reservationService.getAllByCatway);
router.get('/:id/reservations/:idReservation', reservationService.getById);
router.post('/:id/reservations', private.checkJWT, reservationService.create);
router.put('/:id/reservations/:idReservation', private.checkJWT, reservationService.update);
router.delete('/:id/reservations/:idReservation', private.checkJWT, reservationService.delete);

module.exports = router;