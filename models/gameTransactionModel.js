const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');
const GameListModel = require('./gameListModel');

const GameTransactionModel = sequelize.define('GameTransactionModel', {
  transaction_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  game_id: {
    type: DataTypes.INTEGER,
    references: {
      model: GameListModel,
      key: 'id'
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
