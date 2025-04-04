const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");
/**
 * test de commentaire
 */
const User = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "le nom est required"],
      minlength: [
        3,
        "Le nom d utilisateur doit contenir au moins 3 caractères",
      ],
      maxlength: [
        50,
        "Le nom d utilisateur ne peut pas dépasser 50 caractères",
      ],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "L email est required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est required"],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

User.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 10);

  next();
});

module.exports = mongoose.model("User", User);