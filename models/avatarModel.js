const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');

const Avatar = sequelize.define('Avatar', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  image: {
    type: DataTypes.BLOB('long'), // Use BLOB to store the image data
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Avatar;
