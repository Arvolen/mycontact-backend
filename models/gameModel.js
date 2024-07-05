const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');
const User = require('./userModel');

const GameModel = sequelize.define('GameModel', {
  game_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  start_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  end_time: {
    type: DataTypes.DATE
  },
  score: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: false
});

module.exports = GameModel;
