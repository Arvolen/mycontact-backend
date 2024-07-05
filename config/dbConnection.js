// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Setup connection to the database using environment variables
const database = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  logging: false,  // Disable logging
});

async function connectDb() {
  return sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      return sequelize;
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
      throw err;
    });
}


module.exports = { connectDb, sequelize };