// models/announcementModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection'); 

const Announcements = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
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
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('meta');
      if (rawValue) {
        return rawValue;
      }
      const today = new Date().toISOString().split('T')[0];
      return today;
    }},
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
},
{
  tableName: "announcements"
}
);

module.exports = Announcements;
