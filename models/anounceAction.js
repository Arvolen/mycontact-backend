const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');
const Announcements = require('./announcementModel'); // Assuming you have defined Announcement model
const User = require('./userModel'); // Assuming you have defined User model

const UserAnnouncementInteraction = sequelize.define('UserAnnouncementInteraction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  announcementId: {
    type: DataTypes.INTEGER,
    references: {
      model: Announcements,
      key: 'id'
    },
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
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
  timestamps: true
});

// Define associations if needed
UserAnnouncementInteraction.belongsTo(Announcements, { foreignKey: 'announcementId' });
UserAnnouncementInteraction.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserAnnouncementInteraction;