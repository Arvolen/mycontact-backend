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
  senderName:{
    type: DataTypes.STRING,
    allowNull: true,
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
  name:{
    type: DataTypes.STRING,
    allowNull: false,

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
  },
  ChatType:{
    type: DataTypes.ENUM,
    values: ['channel', 'chat'],
    defaultValue: 'channel'
  }
}, {
  timestamps: false,
});

// Define associations
Chat.hasMany(ChatMessage, { foreignKey: 'chatId', as: 'messages' });
ChatMessage.belongsTo(Chat, { foreignKey: 'chatId' });

ChatParticipant.belongsTo(Chat, { foreignKey: 'chatId' });
ChatParticipant.belongsTo(User, { foreignKey: 'userId' });

module.exports = { Chat, ChatMessage, ChatParticipant };
