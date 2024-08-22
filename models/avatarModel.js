const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');

const Avatar = sequelize.define('Avatar', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  imageUrl: {
    type: DataTypes.STRING, // Store the file path or URL as a string
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'avatars',
  timestamps: false
});

module.exports = Avatar;
