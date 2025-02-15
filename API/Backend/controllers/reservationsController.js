const Reservation = require('../models/reservation');


/**
 * Récupère les réservations pour un catway.
 * @param {Object} req - Objet de requête.
 * @param {Object} res - Objet de réponse.
 * @returns {Promise<void>}
 * 
 * Renvoie un objet JSON contenant les réservations pour le catway
 * correspondant à l'ID donné dans les paramètres.
 * En cas d'erreur serveur, répond avec un statut 500 et un message d'erreur.
 */
exports.getReservationsByCatway = async (req, res, next) => {
    try {
        const reservations = await Reservation.find({ catwayNumber: req.params.id });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * Récupère une réservation par son ID.
 * @param {Object} req - Objet de requête.
 * @param {Object} res - Objet de réponse.
 * @returns {Promise<void>}
 * 
 * Renvoie un objet JSON contenant la réservation correspondant à l'ID donné
 * dans les paramètres.
 * Si la réservation n'est pas trouvée, répond avec un statut 404 et un message
 * d'erreur.
 * En cas d'erreur serveur, répond avec un statut 500 et un message d'erreur.
 */
exports.getReservationById = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * Crée une nouvelle réservation.
 * @param {Object} req - Objet de requête.
 * @param {Object} res - Objet de réponse.
 * @returns {Promise<void>}
 * 
 * Renvoie un objet JSON avec la réservation créée.
 * En cas d'erreur de requête, répond avec un statut 400 et un message d'erreur.
 * En cas d'erreur serveur, répond avec un statut 500 et un message d'erreur.
 */
exports.createReservation = async (req, res, next) => {
    try {
        const reservation = new Reservation({ ...req.body, catwayNumber: req.params.id });
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


/**
 * Met à jour une réservation.
 * @param {Object} req - Objet de requête.
 * @param {Object} res - Objet de réponse.
 * @returns {Promise<void>}
 * 
 * Renvoie un objet JSON avec la réservation mise à jour.
 * Si la réservation n'est pas trouvée, répond avec un statut 404 et un message
 * d'erreur.
 * En cas d'erreur de requête, répond avec un statut 400 et un message d'erreur.
 */
exports.updateReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.idReservation,
            req.body,
            { new: true }
        );
        if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


/**
 * Supprime une réservation.
 * @param {Object} req - Objet de requête.
 * @param {Object} res - Objet de réponse.
 * @returns {Promise<void>}
 * 
 * Renvoie un message de confirmation en cas de succès.
 * Si la réservation n'est pas trouvée, répond avec un statut 404 et un message d'erreur.
 * En cas d'erreur serveur, répond avec un statut 500 et un message d'erreur.
 */
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.idReservation);
        if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
        res.status(200).json({ message: 'Réservation supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
