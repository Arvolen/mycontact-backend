const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');


const GameTransactionModel = sequelize.define('GameTransactionModel', {
  transaction_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  game_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'gamelistmodels',
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
  tableName: 'gametransactionmodels',
  timestamps: false
});

module.exports = GameTransactionModel;
