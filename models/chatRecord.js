// models/chatViolationModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');

const ChatViolation = sequelize.define('ChatViolation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  numberOfViolations: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = { ChatViolation };
