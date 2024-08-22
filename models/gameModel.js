const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');


const GameModel = sequelize.define('GameModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  game_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "gamelistmodels",
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: 'id'
    }
  },
  start_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  difficulty: {

    type: DataTypes.STRING,
    allowNull: true
  }
}, {tableName: 'gamemodels',
  timestamps: false
});

module.exports = GameModel;
