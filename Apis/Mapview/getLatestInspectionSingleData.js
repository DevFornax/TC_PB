const { pool } = require("../../db");

const getLatestInspectionSingleData = async (req, res) => {
  try {
    const { location_id } = req.body;


    const query = `
      SELECT 
        id,
        inspection_id,
        inspection_done_by,
        TO_CHAR(inspection_date, 'YYYY-MM-DD HH24:MI:SS') AS inspection_date,
        location_id,
        project_id,
        location_type,
        visual_inspection,
        thermal_inspection,
       TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
        is_deleted,
        location_name,
        remarks,
        actionrequired
      FROM inspections
      WHERE location_id = $1
      ORDER BY inspection_date DESC
      LIMIT 1;
    `;

  
    const result = await pool.query(query, [location_id]);

    if (result.rows.length > 0) {
      const inspectionData = result.rows[0];

   
      const formattedInspectionDate = new Date(
        inspectionData.inspection_date + " UTC"
      ).toISOString();

    
      const finalData = {
        ...inspectionData,
        inspection_date: formattedInspectionDate,
      };


      res.status(200).json(finalData);
    } else {
      res.status(404).json({
        message: "No inspection data found for the given location ID.",
      });
    }
  } catch (error) {
    console.error("Error fetching latest inspection data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = getLatestInspectionSingleData;
