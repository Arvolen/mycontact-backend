const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');
const User = require('./userModel');

const Avatar = sequelize.define('Avatar', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
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

Avatar.belongsTo(User, { foreignKey: 'userId' });

module.exports = Avatar;
