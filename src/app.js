const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const swaggerConfig = require("../swaggerConfig");
const errorMiddleware = require("./middlewares/errorMiddleware");
const router = require("./routes");

const app = express();

app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.use(morgan("dev"));
app.use(router);

app.use(errorMiddleware);

module.exports = app;
