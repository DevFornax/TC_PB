
 
const { pool } = require("../db");

const getNextJobId = async () => {
  const result = await pool.query(
    `SELECT inspection_id FROM inspections ORDER BY id DESC LIMIT 1`
  );

  let lastId = result.rows[0]?.inspection_id || "A0A000";

  let prefix1 = lastId[0];
  let digit = parseInt(lastId[1]);
  let prefix2 = lastId[2];
  let number = parseInt(lastId.slice(3));

  number++;

  if (number > 999) {
    number = 1;

    if (prefix2 === "Z") {
      prefix2 = "A";
      digit++;
      if (digit > 9) {
        digit = 0;
        prefix1 = String.fromCharCode(prefix1.charCodeAt(0) + 1);
      }
    } else {
      prefix2 = String.fromCharCode(prefix2.charCodeAt(0) + 1);
    }
  }

  const newId = `${prefix1}${digit}${prefix2}${String(number).padStart(
    3,
    "0"
  )}`;
  return newId;
};

const submitInspection = async (req, res) => {
  const {
    username,
    inspectionDate,
    locationdata,
    visualInspection,
    thermalInspection,
    notes
  } = req.body;

  const {
    id: locationId,
    parent_id: parentId,
    project_id: projectId,
    project_name: projectName,
    substation_id: substationId,
    substation_name: substationName,
    location_name: locationName,
    attributes,
  } = locationdata;

  try {
    let finalThermalInspection;

    if (thermalInspection === "notdone") {
      finalThermalInspection = JSON.stringify({ status: "notdone" });
    } else {
      finalThermalInspection = JSON.stringify(thermalInspection);
    }

    const inspectionId = await getNextJobId();
    const remarks = notes || null; // ✅ this is the 10th param
    const result = await pool.query(
      `INSERT INTO inspections (
          inspection_id,
          inspection_done_by,
          inspection_date,
          location_id,
          project_id,
          location_type,
          visual_inspection,
          thermal_inspection,
           location_name,
            remarks
        )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id;`,
      [
        inspectionId,
        username,
        inspectionDate,
        locationId,
        projectId,
        attributes.point_type,
        JSON.stringify(visualInspection),
        finalThermalInspection,
        locationName,
        remarks
      ]
    );

    return res.status(200).json({
      message: "Inspection data submitted successfully",
      inspectionId: result.rows[0].id,
      jobId: inspectionId,
    });
  } catch (error) {
    console.error("Error inserting inspection data:", error);
    return res.status(500).json({
      error: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = submitInspection;
