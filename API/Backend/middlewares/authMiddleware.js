const jwt = require('jsonwebtoken');

/**
 * Middleware qui vérifie si le header Authorization contient un token valide.
 * Si le token est valide, il est décodé et l'utilisateur est stocké dans req.user.
 * Si le token est absent ou invalide, une erreur appropriée est envoyée.
 * @param {import('express').Request} req La requête Express.
 * @param {import('express').Response} res La réponse Express.
 * @param {import('express').NextFunction} next La fonction de rappel suivante.
 */
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token invalide.' });
    }
};

module.exports = authMiddleware;
