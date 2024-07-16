// models/announcementModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection'); 

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  meta: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatarAlt: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'message',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatarImg: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '/images/avatars/5.png',
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rewards: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false
});

module.exports = Announcement;
