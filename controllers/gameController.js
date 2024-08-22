const asyncHandler = require('express-async-handler');
const {GameModel, GameListModel, GameTransactionModel} = require('../models/gameModel');


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
  console.log(game)

  if (!game) {
    res.status(404);
    throw new Error('Game not found');
  }

  

if (game.score == null)
{  game.end_time = new Date();
  game.score = score;
  await game.save();
  console.log("Game ended:", game);

  res.status(200).json(game);}

  else {
    res.status(404);
    throw new Error('Game already ended');
  }
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



module.exports = {
  createGame,
  endGame,
  getAllGames
};
