// models/announcementModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection'); 
const User = require('./userModel');


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


module.exports = {Announcements, UserAnnouncementInteraction};
