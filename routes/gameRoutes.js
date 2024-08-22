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

// User
router.use(validateToken);
router.get('/', getAllGames);
router.post('/start', createGame);
router.post('/start/end', endGame);


module.exports = router;
