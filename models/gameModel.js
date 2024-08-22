const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');


const GameModel = sequelize.define('GameModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  game_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "gamelistmodels",
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: 'id'
    }
  },
  start_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  difficulty: {

    type: DataTypes.STRING,
    allowNull: true
  }
}, {tableName: 'gamemodels',
  timestamps: false
});

const GameListModel = sequelize.define('GameListModel', {
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
     allowNull: true
   },
   releaseDate: {
     type: DataTypes.DATE,
     allowNull: true
   },
   genre: {
     type: DataTypes.STRING,
     allowNull: true
   },
 }, {
   tableName: 'gamelistmodels',
   timestamps: false
 });

 const GameTransactionModel = sequelize.define('GameTransactionModel', {
  transaction_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  game_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'gamelistmodels',
      key: 'id'
    }
  },
  event_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  event_type: {
    type: DataTypes.STRING
  },
  details: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'gametransactionmodels',
  timestamps: false
});


module.exports = {GameModel, GameListModel, GameTransactionModel};
