const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservationsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/:id/reservations",
  authMiddleware,
  reservationsController.getReservationsByCatway
);

router.get(
  "/:id/reservations/:idReservation",
  authMiddleware,
  reservationsController.getReservationById
);

router.post(
  "/:id/reservations",
  authMiddleware,
  reservationsController.createReservation
);

router.put(
  "/:id/reservations/:idReservation",
  authMiddleware,
  reservationsController.updateReservation
);

router.delete(
  "/:id/reservations/:idReservation",
  authMiddleware,
  reservationsController.deleteReservation
);

module.exports = router;
