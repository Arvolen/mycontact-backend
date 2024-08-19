const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');
const Announcements = require('./announcementModel');
const User = require('./userModel');

const UserAnnouncementInteraction = sequelize.define('UserAnnouncementInteraction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  announcementId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'announcements',
      key: 'id'
    },
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    allowNull: false
  },
  seen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rewardsClaimed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  liked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "userannouncementinteractions",
  timestamps: true
});

// Define associations if needed
UserAnnouncementInteraction.belongsTo(Announcements, { foreignKey: 'announcementId' });
UserAnnouncementInteraction.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserAnnouncementInteraction;