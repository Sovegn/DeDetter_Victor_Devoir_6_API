const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

// Fonction pour les rendus EJS
exports.getAllUsers = async () => {
  try {
    return await User.find({}, '-password -__v');
  } catch (error) {
    console.error("Erreur récupération des utilisateurs:", error);
    return [];
  }
};

exports.authenticate = async (req, res, next) => {
  const { email, password } = req.body; 

  try {
    const user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

    if (user) {
      bcrypt.compare(password, user.password, function(err, response) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (response) {
          delete user._doc.password;

          const expireIn = 24 * 60 * 60;
          const token = jwt.sign({
            user: user
          },
          SECRET_KEY,
          {
            expiresIn: expireIn
          });

          res.header('Authorization','Bearer ' + token);

          return res.status(200).json('authenticate_succeed');
        }
        
        return res.status(403).json('wrong_credentials');
      });
    } else {
      return res.status(404).json('user_not_found');
    }
  } catch (error) {
    return res.status(501).json({ error: error.message });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password -__v');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(501).json({ error: error.message });
  }
};

exports.getByEmail = async (req, res, next) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email: email }, '-password -__v');

    if (user) {
      return res.status(200).json(user);
    }

    return res.status(404).json("user_not_found");
  } catch (error) {
    return res.status(501).json({ error: error.message });
  }
};

exports.add = async (req, res, next) => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json("email_already_exists");
    }

    let user = await User.create(userData);
    user = user.toObject();
    delete user.password;

    return res.status(201).json(user);
  } catch (error) {
    return res.status(501).json({ error: error.message });
  }
};

exports.update = async (req, res, next) => {
  const email = req.params.email;
  const updateData = {};
  
  // Only update fields that are provided
  if (req.body.username) updateData.username = req.body.username;
  
  // Traiter le mot de passe séparément pour le hachage
  let password = null;
  if (req.body.password) {
    password = req.body.password;
  }

  try {
    let user = await User.findOne({ email: email });

    if (user) {
      // Mettre à jour les champs standard
      Object.keys(updateData).forEach((key) => {
        user[key] = updateData[key];
      });
      
      // Gérer le mot de passe séparément - le modèle s'occupera du hachage
      if (password) {
        user.password = password;
      }

      await user.save();
      user = user.toObject();
      delete user.password;
      
      return res.status(200).json(user);
    }

    return res.status(404).json("user_not_found");
  } catch (error) {
    return res.status(501).json({ error: error.message });
  }
};

exports.delete = async (req, res, next) => {
  const email = req.params.email;

  try {
    const result = await User.deleteOne({ email: email });
    
    if (result.deletedCount === 0) {
      return res.status(404).json("user_not_found");
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(501).json({ error: error.message });
  }
};