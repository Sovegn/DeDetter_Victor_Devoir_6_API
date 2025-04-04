const Catway = require("../models/catway");
const Reservation = require("../models/reservation");

// Fonction pour les appels API
exports.getAll = async (req, res, next) => {
  try {
    const catways = await Catway.find({}, '-__v');
    return res.status(200).json(catways);
  } catch (error) {
    return res.status(501).json(error);
  }
};

// Fonction pour les rendus EJS
exports.getAllCatways = async () => {
  try {
    return await Catway.find({}, '-__v');
  } catch (error) {
    console.error("Erreur récupération des catways:", error);
    return [];
  }
};

exports.getById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const catway = await Catway.findOne({ catwayNumber: id });

    if (catway) {
      return res.status(200).json(catway);
    }

    return res.status(404).json("catway_not_found");
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.create = async (req, res, next) => {
  const catwayData = {
    catwayNumber: req.body.catwayNumber,
    catwayType: req.body.catwayType,
    catwayState: req.body.catwayState
  };

  try {
    // Check if catway number already exists
    const existingCatway = await Catway.findOne({ catwayNumber: catwayData.catwayNumber });
    if (existingCatway) {
      return res.status(400).json("catway_number_already_exists");
    }

    let catway = await Catway.create(catwayData);
    return res.status(201).json(catway);
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  
  try {
    let catway = await Catway.findOne({ catwayNumber: id });

    if (catway) {
      // Only allow updating the state, not the number or type
      if (req.body.catwayState) {
        catway.catwayState = req.body.catwayState;
      }

      await catway.save();
      return res.status(200).json(catway);
    }

    return res.status(404).json("catway_not_found");
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    // First check if there are any active reservations
    const activeReservations = await Reservation.find({ catwayNumber: id });
    if (activeReservations && activeReservations.length > 0) {
      return res.status(400).json("cannot_delete_catway_with_reservations");
    }

    const result = await Catway.deleteOne({ catwayNumber: id });

    if (result.deletedCount === 0) {
      return res.status(404).json("catway_not_found");
    }

    return res.status(204).json("delete_ok");
  } catch (error) {
    return res.status(501).json(error);
  }
};