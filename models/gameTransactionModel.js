const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');
const GameModel = require('./gameModel');

const GameTransactionModel = sequelize.define('GameTransactionModel', {
  transaction_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  game_id: {
    type: DataTypes.INTEGER,
    references: {
      model: GameModel,
      key: 'game_id'
    }
  },
  event_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  event_type: {
    type: DataTypes.STRING
  },
  details: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: false
});

module.exports = GameTransactionModel;
