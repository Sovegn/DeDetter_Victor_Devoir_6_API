// models/catway.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Catway = new Schema(
  {
    catwayNumber: {
      type: String,
      required: [true, "Le numéro de catway est requis"],
      unique: true,
      trim: true
    },
    catwayType: {
      type: String,
      enum: ["long", "short"],
      required: [true, "Le type de catway est requis"]
    },
    catwayState: {
      type: String,
      default: "Bon état"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Catway", Catway);