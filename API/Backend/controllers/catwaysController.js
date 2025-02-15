const Catway = require('../models/catway');

/**
 * Récupère tous les catways.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise<void>}
 * 
 * Returns a JSON object with all the catways in the database.
 * If there is a server error, responds with a 500 status and error message.
 */
exports.getAllCatways = async (req, res, next) => {
    try {
        const catways = await Catway.find();
        res.status(200).json(catways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Récupère un catway par son identifiant.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise<void>}
 * 
 * Returns a JSON object with the catway corresponding to the given
 * id in the request parameters.
 * If there is a server error, responds with a 500 status and error message.
 * If the catway is not found, responds with a 404 status and error message.
 */
exports.getCatwayById = async (req, res, next) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) return res.status(404).json({ message: 'Catway introuvable' });
        res.status(200).json(catway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Crée un nouveau catway.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise<void>}
 * 
 * Returns a JSON object with the newly created catway.
 * If there is a server error, responds with a 500 status and error message.
 */
exports.createCatway = async (req, res, next) => {
    try {
        const catway = new Catway(req.body);
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Met à jour l'état d'un catway.
 * @param {Object} req - Request object contenant les paramètres du catway et l'état à mettre à jour.
 * @param {Object} res - Response object pour envoyer la réponse HTTP.
 * @returns {Promise<void>}
 * 
 * Renvoie un objet JSON avec le catway mis à jour.
 * Si le catway n'est pas trouvé, répond avec un statut 404 et un message d'erreur.
 * En cas d'erreur de requête, répond avec un statut 400 et un message d'erreur.
 */

exports.updateCatwayState = async (req, res, next) => {
    try {
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id },
            { catwayState: req.body.catwayState },
            { new: true }
        );
        if (!catway) return res.status(404).json({ message: 'Catway introuvable' });
        res.status(200).json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Supprime un catway.
 * @param {Object} req - Request object contenant l'identifiant du catway à supprimer.
 * @param {Object} res - Response object pour envoyer la réponse HTTP.
 * @returns {Promise<void>}
 * 
 * Renvoie un objet JSON avec un message de confirmation.
 * Si le catway n'est pas trouvé, répond avec un statut 404 et un message d'erreur.
 * En cas d'erreur de requête, répond avec un statut 400 et un message d'erreur.
 */
exports.deleteCatway = async (req, res, next) => {
    try {
        const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
        if (!catway) return res.status(404).json({ message: 'Catway introuvable' });
        res.status(200).json({ message: 'Catway supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
