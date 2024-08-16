const express = require('express');
const validateToken = require("../middleware/validateToken");
const isAdminHandler = require("../middleware/isAdminHandler");
const {
    createGame,
    endGame,
    logTransaction,
    getAllGames,
    getGameDetails,
    getUserGames
} = require('../controllers/gameController');

const router = express.Router();

// Admin
router.get('/', validateToken, isAdminHandler, getAllGames);
router.get('/:id', validateToken, isAdminHandler, getGameDetails);

// User
router.use(validateToken);
router.post('/start', createGame);
router.post('/start/end', endGame);
router.post('/transaction', logTransaction);
router.get('/user', getUserGames);

module.exports = router;
