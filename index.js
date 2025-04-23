const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const authMiddleware = require("./auth/auth");


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const submitData = require("./Apis/submitdata");
// const checkLocationExist = require("./Apis/checkLocationExist")
const LoginApi = require("./Apis/login")
const fetchLocationDataByIds = require("./Apis/Inspection_Module/fetchlocationdata");
const fetchMaintananceJob = require("./Apis/Inspection_Module/fetchMaitananceJob");
const submitInspection = require("./Apis/Inspection_Module/submitInspection")
const getInspactionRecords = require("./Apis/Data_dashboard/getInspectionRecords");
const DeleteInspectionJob = require("./Apis/Data_dashboard/deleteInspectionJob");
const getProjectData = require("./Apis/Mapview/getProjectData")
const getLatestInspectionForMap = require("./Apis/Mapview/getLatestInspecctionForMap")



app.get("/", function (req, res) {
  res.send("Welcome to Fornax TwinVis Apis");
});

// app.post("/submitdata", authMiddleware, submitData);
app.post("/get-location-data", authMiddleware, fetchLocationDataByIds);
app.get("/get-job-list", authMiddleware, fetchMaintananceJob);
app.post("/login" , LoginApi)
app.post("/submit-inspection" ,authMiddleware, submitInspection)
app.post("/get-inspection",  authMiddleware, getInspactionRecords); 
app.delete("/delete-inspection", authMiddleware, DeleteInspectionJob);
app.post("/get-project-data" ,authMiddleware,  getProjectData)
app.post("/get-latestdata-actionreq" , authMiddleware , getLatestInspectionForMap)


db.testConnection();

app.listen(port, () => {  
  console.log(`🚀 Server running on port ${port}`);
});


