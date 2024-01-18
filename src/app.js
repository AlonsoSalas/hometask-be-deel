const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const errorMiddleware = require("./middlewares/errorMiddleware");
const router = require("./routes");

const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(router);
app.use(errorMiddleware);

module.exports = app;
