const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors")

connectDb();

const app = express();


const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/contacts', require("./routes/contactRoutes"));
app.use('/api/users', require("./routes/userRoutes"));
app.use(errorHandler);
app.use(cors())

app.listen(port, () =>  {

    console.log('Server Running on port ' + port )

});