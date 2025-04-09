const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const fetchLocationDataByIds = require("./Apis/fetchlocationdata");
const submitData = require("./Apis/submitdata");
const checkLocationExist = require("./Apis/checkLocationExist")
const fetchMaintananceJob = require("./Apis/fetchMaitananceJob")

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/get-location-data", fetchLocationDataByIds);
app.post("/check-location-exist" , checkLocationExist);
app.post("/submitdata", submitData);
app.get("/get-job-list", fetchMaintananceJob)

db.testConnection();

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
