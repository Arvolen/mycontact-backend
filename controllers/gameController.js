const asyncHandler = require('express-async-handler');
const GameModel = require('../models/gameModel');
const GameListModel = require('../models/gameListModel');
const GameTransactionModel = require('../models/gameTransactionModel');

// @desc Create a new game
// @route POST /api/games/start
// @access Private
const createGame = asyncHandler(async (req, res) => {

  const { id, difficulty } = req.body;
  const  user_id  = req.user.id;
  console.log("Starting a new game for user", user_id);

  const game_data = await GameListModel.findByPk(id);

  console.log("GameData found")
  const game_id = game_data.id
  console.log("Game Id found")

  const game = await GameModel.create({ user_id, game_id, difficulty });
  console.log("Game started:", game);

  res.status(201).json(game);
});

// @desc End a game
// @route POST /api/games/end
// @access Private
const endGame = asyncHandler(async (req, res) => {
  const { id, score } = req.body;

  console.log("Ending game with ID:", id);

  const game = await GameModel.findByPk(id);

  if (!game) {
    res.status(404);
    throw new Error('Game not found');
  }

  game.end_time = new Date();
  game.score = score;
  await game.save();
  console.log("Game ended:", game);

  res.status(200).json(game);
});

// @desc Log a game transaction
// @route POST /api/games/transaction
// @access Private
const logTransaction = asyncHandler(async (req, res) => {
  const { game_id, event_type, details } = req.body;
  console.log("Logging transaction for game", game_id);

  const transaction = await GameTransactionModel.create({ game_id, event_type, details });
  console.log("Transaction logged:", transaction);

  res.status(201).json(transaction);
});

// @desc Get all games (Admin only)
// @route GET /api/games
// @access Private (Admin)
const getAllGames = asyncHandler(async (req, res) => {
  console.log("Fetching all games");

  const games = await GameModel.findAll();
  console.log("Games fetched:", games);

  res.status(200).json(games);
});

// @desc Get game details by ID (Admin only)
// @route GET /api/games/:id
// @access Private (Admin)
const getGameDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("Fetching details for game ID:", id);

  const game = await GameModel.findByPk(id);
  if (!game) {
    res.status(404);
    throw new Error('Game not found');
  }

  console.log("Game details fetched:", game);
  res.status(200).json(game);
});

// @desc Get all games for the logged-in user
// @route GET /api/games/user
// @access Private
const getUserGames = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  console.log("Fetching games for user ID:", userId);

  const games = await GameModel.findAll({ where: { user_id: userId } });
  console.log("Games fetched for user:", games);

  res.status(200).json(games);
});


module.exports = {
  createGame,
  endGame,
  logTransaction,
  getAllGames,
  getGameDetails,
  getUserGames
};
