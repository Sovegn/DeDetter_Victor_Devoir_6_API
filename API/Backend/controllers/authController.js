const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Register a new user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 *
 * @returns {Promise<void>}
 */

exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60,
        });

        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Authenticate a user and generate a JWT token.
 * @param {Object} req - Request object containing email and password.
 * @param {Object} res - Response object to send back the JWT token.
 * 
 * @returns {Promise<void>}
 * 
 * If the email or password is invalid, responds with a 400 status and error message.
 * On successful authentication, responds with a 200 status and JWT token.
 * If there is a server error, responds with a 500 status and error message.
 */

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Identifiants invalides.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Identifiants invalides.' });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn:60 * 60,
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
