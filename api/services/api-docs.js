const Catway = require("../models/catway");
const Reservation = require("../models/reservation");
const User = require("../models/user");

exports.getApiDocumentation = async (req, res, next) => {
  const apiDocs = {
    name: process.env.APP_NAME,
    version: "1.0",
    description: "API de gestion du port de plaisance de Russell",
    endpoints: {
      authentication: {
        login: {
          url: "/api/login",
          method: "POST",
          body: { email: "String", password: "String" },
          response: "Token d'authentification"
        },
        logout: {
          url: "/api/logout",
          method: "GET",
          response: "Déconnexion et redirection"
        }
      },
      catways: {
        getAll: {
          url: "/api/catways",
          method: "GET",
          response: "Liste des catways"
        },
        getById: {
          url: "/api/catways/:id",
          method: "GET",
          response: "Détails d'un catway"
        },
        create: {
          url: "/api/catways",
          method: "POST",
          body: {
            catwayNumber: "String",
            catwayType: "String (long/short)",
            catwayState: "String"
          },
          response: "Nouveau catway créé"
        },
        update: {
          url: "/api/catways/:id",
          method: "PUT",
          body: { catwayState: "String" },
          response: "Catway mis à jour"
        },
        delete: {
          url: "/api/catways/:id",
          method: "DELETE",
          response: "Catway supprimé"
        }
      },
      reservations: {
        getAllByCatway: {
          url: "/api/catways/:id/reservations",
          method: "GET",
          response: "Liste des réservations pour un catway"
        },
        getById: {
          url: "/api/catways/:id/reservations/:idReservation",
          method: "GET",
          response: "Détails d'une réservation"
        },
        create: {
          url: "/api/catways/:id/reservations",
          method: "POST",
          body: {
            clientName: "String",
            boatName: "String",
            startDate: "Date",
            endDate: "Date"
          },
          response: "Nouvelle réservation créée"
        },
        update: {
          url: "/api/catways/:id/reservations/:idReservation",
          method: "PUT",
          body: {
            clientName: "String (optionnel)",
            boatName: "String (optionnel)",
            startDate: "Date (optionnel)",
            endDate: "Date (optionnel)"
          },
          response: "Réservation mise à jour"
        },
        delete: {
          url: "/api/catways/:id/reservations/:idReservation",
          method: "DELETE",
          response: "Réservation supprimée"
        }
      },
      users: {
        getAll: {
          url: "/api/users",
          method: "GET",
          response: "Liste des utilisateurs"
        },
        getByEmail: {
          url: "/api/users/:email",
          method: "GET",
          response: "Détails d'un utilisateur"
        },
        create: {
          url: "/api/users",
          method: "POST",
          body: {
            username: "String",
            email: "String",
            password: "String"
          },
          response: "Nouvel utilisateur créé"
        },
        update: {
          url: "/api/users/:email",
          method: "PUT",
          body: {
            username: "String (optionnel)",
            password: "String (optionnel)"
          },
          response: "Utilisateur mis à jour"
        },
        delete: {
          url: "/api/users/:email",
          method: "DELETE",
          response: "Utilisateur supprimé"
        }
      }
    }
  };

  return res.status(200).json(apiDocs);
};