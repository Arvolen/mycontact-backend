const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection'); // Adjust the path as necessary
const User = require('./userModel');

// Define the ChatMessage model representing individual messages
const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

// Define the Chat model representing the entire chat conversation
const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  unseenMsgs: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastMessageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ChatMessage,
      key: 'id',
    },
  },
}, {
  timestamps: false,
});

// Define the ChatParticipant model representing users in a chat
const ChatParticipant = sequelize.define('ChatParticipant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Chat,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  about: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatarColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active: {

    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  timestamps: false,
});

// Define associations
Chat.hasMany(ChatMessage, { foreignKey: 'chatId', as: 'messages' });
ChatMessage.belongsTo(Chat, { foreignKey: 'chatId' });

Chat.belongsTo(User, { foreignKey: 'userId' });
ChatParticipant.belongsTo(Chat, { foreignKey: 'chatId' });
ChatParticipant.belongsTo(User, { foreignKey: 'userId' });

module.exports = { Chat, ChatMessage, ChatParticipant };
