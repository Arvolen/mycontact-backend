const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/dbConnection'); 

const ChatChannel = sequelize.define('ChatChannel', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
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
    })

module.exports = ChatChannel;