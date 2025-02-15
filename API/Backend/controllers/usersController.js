const User = require('../models/user');


/**
 * Récupère tous les utilisateurs.
 * @param {Object} req - Objet de requête.
 * @param {Object} res - Objet de réponse.
 * @returns {Promise<void>}
 * 
 * Renvoie un objet JSON contenant tous les utilisateurs dans la base de données.
 * En cas d'erreur serveur, répond avec un statut 500 et un message d'erreur.
 */

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * Récupère un utilisateur par son e-mail.
 * @param {Object} req - Objet de requête.
 * @param {Object} res - Objet de réponse.
 * @returns {Promise<void>}
 * 
 * Renvoie un objet JSON contenant l'utilisateur correspondant à l'e-mail
 * donnée dans la requête.
 * Si l'utilisateur n'est pas trouvé, répond avec un statut 404 et un message
 * d'erreur.
 * En cas d'erreur serveur, répond avec un statut 500 et un message d'erreur.
 */
exports.getUserByEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * Crée un nouvel utilisateur.
 * @param {Object} req - Objet de requête contenant les détails de l'utilisateur dans le corps.
 * @param {Object} res - Objet de réponse pour envoyer la réponse HTTP.
 * @returns {Promise<void>}
 * 
 * En cas de succès, renvoie un objet JSON avec l'utilisateur créé et un statut 201.
 * En cas d'erreur de requête, répond avec un statut 400 et un message d'erreur.
 */

exports.createUser = async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


/**
 * Met à jour un utilisateur.
 * @param {Object} req - Objet de requête contenant l'e-mail de l'utilisateur
 *                       à mettre à jour dans les paramètres et les détails
 *                       de mise à jour dans le corps.
 * @param {Object} res - Objet de réponse pour envoyer la réponse HTTP.
 * @returns {Promise<void>}
 * 
 * Renvoie un objet JSON avec l'utilisateur mis à jour.
 * Si l'utilisateur n'est pas trouvé, répond avec un statut 404 et un message
 * d'erreur.
 * En cas d'erreur de requête, répond avec un statut 400 et un message d'erreur.
 */
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            req.body,
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


/**
 * Supprime un utilisateur.
 * @param {Object} req - Objet de requête contenant l'e-mail de l'utilisateur à supprimer dans les paramètres.
 * @param {Object} res - Objet de réponse pour envoyer la réponse HTTP.
 * @returns {Promise<void>}
 * 
 * Renvoie un message de confirmation en cas de succès.
 * Si l'utilisateur n'est pas trouvé, répond avec un statut 404 et un message d'erreur.
 * En cas d'erreur serveur, répond avec un statut 500 et un message d'erreur.
 */

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findOneAndDelete({ email: req.params.email });
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
        res.status(200).json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
