const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/dbConnection");
const freelanceRoutes = require("./routes/freelance/freelance");
const clientroutes = require("./routes/client/client")
const missionsRoutes = require("./routes/missions/mission")

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.use("/api", freelanceRoutes);
app.use("/api", clientroutes)
app.use("/api", missionsRoutes)

module.exports = app;
