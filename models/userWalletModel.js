const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');
const User = require('./userModel');

const UserWallet = sequelize.define('UserWallet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    allowNull: false
  },
  balance: {
    type: DataTypes.FLOAT, 
    defaultValue: 0.0,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD' // Default currency can be adjusted
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  tableName: 'userwallets',
  timestamps: true
});

UserWallet.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserWallet;
