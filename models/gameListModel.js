const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');

const GameListModel = sequelize.define('GameListModel', {
 id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  timestamps: false
});

module.exports = GameListModel;
