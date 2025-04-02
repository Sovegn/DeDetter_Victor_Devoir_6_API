const Reservation = require("../models/reservation");
const Catway = require("../models/catway");

exports.getAllByCatway = async (req, res, next) => {
  const catwayId = req.params.id;

  try {
    // First check if the catway exists
    const catway = await Catway.findOne({ catwayNumber: catwayId });
    if (!catway) {
      return res.status(404).json("catway_not_found");
    }

    const reservations = await Reservation.find({ catwayNumber: catwayId }, '-__v');
    console.log("Données récupérées:", reservations);
    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Erreur:", error);
    return res.status(501).json(error);
  }
};

exports.getById = async (req, res, next) => {
  const catwayId = req.params.id;
  const reservationId = req.params.idReservation;

  try {
    const reservation = await Reservation.findOne({ 
      _id: reservationId,
      catwayNumber: catwayId 
    });

    if (reservation) {
      return res.status(200).json(reservation);
    }

    return res.status(404).json("reservation_not_found");
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.create = async (req, res, next) => {
  const catwayId = req.params.id;
  
  try {
    // Check if the catway exists
    const catway = await Catway.findOne({ catwayNumber: catwayId });
    if (!catway) {
      return res.status(404).json("catway_not_found");
    }

    // Check for overlapping reservations
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    if (startDate >= endDate) {
      return res.status(400).json("invalid_date_range");
    }

    const overlappingReservation = await Reservation.findOne({
      catwayNumber: catwayId,
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
      ]
    });

    if (overlappingReservation) {
      return res.status(400).json("reservation_date_conflict");
    }

    const reservationData = {
      catwayNumber: catwayId,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: startDate,
      endDate: endDate
    };

    const reservation = await Reservation.create(reservationData);
    return res.status(201).json(reservation);
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.update = async (req, res, next) => {
  const catwayId = req.params.id;
  const reservationId = req.params.idReservation;

  try {
    let reservation = await Reservation.findOne({ 
      _id: reservationId,
      catwayNumber: catwayId 
    });

    if (!reservation) {
      return res.status(404).json("reservation_not_found");
    }

    // Handle date updates with conflict checking
    let startDate = reservation.startDate;
    let endDate = reservation.endDate;
    
    if (req.body.startDate) startDate = new Date(req.body.startDate);
    if (req.body.endDate) endDate = new Date(req.body.endDate);

    if (startDate >= endDate) {
      return res.status(400).json("invalid_date_range");
    }

    // Check for conflicts with other reservations
    if (req.body.startDate || req.body.endDate) {
      const overlappingReservation = await Reservation.findOne({
        catwayNumber: catwayId,
        _id: { $ne: reservationId }, // Exclure la réservation courante
        $or: [
          { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
        ]
      });

      if (overlappingReservation) {
        return res.status(400).json("reservation_date_conflict");
      }
    }

    // Update fields
    if (req.body.clientName !== undefined) reservation.clientName = req.body.clientName;
    if (req.body.boatName !== undefined) reservation.boatName = req.body.boatName;
    if (req.body.startDate !== undefined) reservation.startDate = startDate;
    if (req.body.endDate !== undefined) reservation.endDate = endDate;

    await reservation.save();
    return res.status(200).json(reservation);
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.delete = async (req, res, next) => {
  const catwayId = req.params.id;
  const reservationId = req.params.idReservation;

  try {
    const result = await Reservation.deleteOne({ 
      _id: reservationId,
      catwayNumber: catwayId 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json("reservation_not_found");
    }

    return res.status(204).json("delete_ok");
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.getCurrentReservations = async () => {
  try {
    const today = new Date();
    const currentReservations = await Reservation.find({
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    return currentReservations; //Retourne directement les réservations
  } catch (error) {
    console.error("Erreur récupération des réservations:", error);
    return []; // Retourne un tableau vide en cas d'erreur pour éviter l'erreur dans EJS
  }
};

exports.getAllReservations = async () => {
  try {
    return await Reservation.find({}, '-__v');
  } catch (error) {
    console.error("Erreur récupération des réservations:", error);
    return [];
  }
};