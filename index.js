const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const authMiddleware = require("./auth/auth");

const fetchLocationDataByIds = require("./Apis/fetchlocationdata");
const submitData = require("./Apis/submitdata");
const checkLocationExist = require("./Apis/checkLocationExist")
const fetchMaintananceJob = require("./Apis/fetchMaitananceJob")
const LoginApi = require("./Apis/login")
const submitInspection = require("./Apis/submitInspection")

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/get-location-data", authMiddleware, fetchLocationDataByIds);
app.post("/check-location-exist", authMiddleware, checkLocationExist);
app.post("/submitdata", authMiddleware, submitData);
app.get("/get-job-list", authMiddleware, fetchMaintananceJob);
app.post("/login" , LoginApi)
app.post("/submit-inspection" ,authMiddleware, submitInspection)

db.testConnection();

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
