var express = require('express');
var router = express.Router();

const userRoutes = require('./users');
const catwayRoutes = require('./catways');
const authController = require('../services/auth');
const private = require('../middlewares/private');
const apiDocsService = require('../services/api-docs');
const reservationService = require('../services/reservations');
const catwayService = require('../services/catways');
const userService = require('../services/users');

const Catway = require("../models/catway");
const Reservation = require("../models/reservation");
const User = require("../models/user");

router.get('/', function(req, res) {
  res.redirect('/login');
});

// Ajout d'une route dédiée pour la page de login
router.get('/login', function(req, res) {
  res.render('login');
});

// API routes
router.use('/api/users', userRoutes);
router.use('/api/catways', catwayRoutes);
router.get('/api/docs', apiDocsService.getApiDocumentation);

// Auth routes
router.post('/api/login', authController.login);
router.get('/api/logout', authController.logout);

// Dashboard routes
router.get('/dashboard', private.checkJWT, async function(req, res) {
  try {
    const reservations = await reservationService.getCurrentReservations();
    res.render('dashboard', { 
      user: req.decoded.user,
      date: new Date(),
      reservations: reservations
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Erreur serveur',
      message: 'Une erreur s\'est produite lors du chargement du tableau de bord.'
    });
  }
});

// Page de gestion des catways
router.get('/catways', private.checkJWT, async function(req, res) {
  try {
    const catwaysData = await catwayService.getAllCatways();
    res.render('catways', { 
      user: req.decoded.user,
      catways: catwaysData
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Erreur serveur',
      message: 'Une erreur s\'est produite lors du chargement des catways.'
    });
  }
});

// Page d'édition d'un catway
router.get('/catways/edit/:id', private.checkJWT, async function(req, res) {
  try {
    const catwayId = req.params.id;
    const catway = await Catway.findOne({ catwayNumber: catwayId });
    
    if (!catway) {
      return res.status(404).render('error', {
        title: 'Catway introuvable',
        message: 'Le catway demandé n\'existe pas.'
      });
    }
    
    res.render('edit-catways', { 
      user: req.decoded.user,
      catway: catway
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Erreur serveur',
      message: 'Une erreur s\'est produite lors du chargement du catway.'
    });
  }
});

// Page de gestion des réservations
router.get('/reservations', private.checkJWT, async function(req, res) {
  try {
    const reservationsData = await reservationService.getAllReservations();
    res.render('reservations', { 
      user: req.decoded.user,
      reservations: reservationsData
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Erreur serveur',
      message: 'Une erreur s\'est produite lors du chargement des réservations.'
    });
  }
});

// Page d'édition d'une réservation
router.get('/reservations/edit/:catwayId/:reservationId', private.checkJWT, async function(req, res) {
  try {
    const catwayId = req.params.catwayId;
    const reservationId = req.params.reservationId;
    
    const reservation = await Reservation.findOne({ 
      _id: reservationId,
      catwayNumber: catwayId 
    });
    
    if (!reservation) {
      return res.status(404).render('error', {
        title: 'Réservation introuvable',
        message: 'La réservation demandée n\'existe pas.'
      });
    }
    
    res.render('edit-reservation', { 
      user: req.decoded.user,
      reservation: reservation
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Erreur serveur',
      message: 'Une erreur s\'est produite lors du chargement de la réservation.'
    });
  }
});

// Page de gestion des utilisateurs
router.get('/users', private.checkJWT, async function(req, res) {
  try {
    const usersData = await userService.getAllUsers();
    res.render('users', { 
      user: req.decoded.user,
      users: usersData
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Erreur serveur',
      message: 'Une erreur s\'est produite lors du chargement des utilisateurs.'
    });
  }
});

// Page d'édition d'un utilisateur
router.get('/users/edit/:email', private.checkJWT, async function(req, res) {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email: email }, '-password');
    
    if (!user) {
      return res.status(404).render('error', {
        title: 'Utilisateur introuvable',
        message: 'L\'utilisateur demandé n\'existe pas.'
      });
    }
    
    res.render('edit-user', { 
      user: req.decoded.user,
      userToEdit: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Erreur serveur',
      message: 'Une erreur s\'est produite lors du chargement de l\'utilisateur.'
    });
  }
});

// Route pour afficher la documentation API
router.get('/api-docs', private.checkJWT, function(req, res) {
  res.render('api-docs', {
    user: req.decoded.user
  });
});

module.exports = router;