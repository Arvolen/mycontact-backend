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


// User
router.use(validateToken);
router.post('/start', createGame);
router.post('/start/end', endGame);


module.exports = router;
