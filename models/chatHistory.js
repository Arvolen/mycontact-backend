const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/dbConnection'); 
const ChatChannel = require('./chatChannel');
const User = require('./userModel');

const ChatHistory = sequelize.define('ChatHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      channelId: {
        type: DataTypes.INTEGER,
        references: {
          model: ChatChannel,
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
      message: {
        type: DataTypes.STRING,
        defaultValue: false,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
    });
    
    // Define associations if needed
    ChatHistory.belongsTo(ChatChannel, { foreignKey: 'channelId' });
    ChatHistory.belongsTo(User, { foreignKey: 'userId' });
    
    module.exports = ChatHistory;