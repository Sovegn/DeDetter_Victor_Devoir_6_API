const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, usersController.getAllUsers);


router.get('/:email', authMiddleware, usersController.getUserByEmail);


router.post('/', authMiddleware, usersController.createUser);


router.put('/:email', authMiddleware, usersController.updateUser);


router.delete('/:email', authMiddleware, usersController.deleteUser);

module.exports = router;
