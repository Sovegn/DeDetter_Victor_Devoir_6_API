// models/reservation.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Reservation = new Schema(
  {
    catwayNumber: {
      type: String,
      required: [true, "Le numéro de catway est requis"],
      trim: true
    },
    clientName: {
      type: String,
      required: [true, "Le nom du client est requis"],
      trim: true,
      minlength: [2, "Le nom du client doit contenir au moins 2 caractères"]
    },
    boatName: {
      type: String,
      required: [true, "Le nom du bateau est requis"],
      trim: true
    },
    startDate: {
      type: Date,
      required: [true, "La date de début est requise"]
    },
    endDate: {
      type: Date,
      required: [true, "La date de fin est requise"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reservation", Reservation);