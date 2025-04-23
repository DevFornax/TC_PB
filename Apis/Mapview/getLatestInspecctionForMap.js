const { pool } = require("../../db");

const getLatestInspectionForMap = async (req, res) => {
  try {
    const { id, method } = req.body;

    if (!id || !method) {
      return res.status(400).json({ message: "ID and method are required" });
    }

    let projectId;

    if (method === "location") {
      const locQuery = await pool.query(
        `SELECT project_id FROM inspections WHERE location_id = $1 AND (is_deleted IS DISTINCT FROM 'Y') LIMIT 1`,
        [id]
      );

      if (locQuery.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "No active inspection found for this location." });
      }

      projectId = locQuery.rows[0].project_id;
    } else if (method === "project") {
      projectId = id;
    } else {
      return res.status(400).json({ message: "Invalid method" });
    }

    const result = await pool.query(
      `
  SELECT 
    i.id,
    i.inspection_id,
    i.inspection_done_by,
    TO_CHAR(i.inspection_date, 'YYYY-MM-DD HH24:MI:SS') AS inspection_date,
    i.location_id,
    i.project_id,
    i.location_type,
    i.visual_inspection,
    i.thermal_inspection,
    TO_CHAR(i.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
    i.is_deleted,
    i.location_name,
    i.remarks,
    i.actionrequired
  FROM inspections i
  INNER JOIN (
    SELECT location_id, MAX(inspection_date) AS max_date
    FROM inspections
    WHERE project_id = $1 AND (is_deleted IS DISTINCT FROM 'Y')
    GROUP BY location_id
  ) latest
    ON latest.location_id = i.location_id
    AND latest.max_date = i.inspection_date
  WHERE i.project_id = $1 AND (i.is_deleted IS DISTINCT FROM 'Y')
  ORDER BY i.inspection_date DESC
  `,
      [projectId]
    );

    res.status(200).json({ inspections: result.rows });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = getLatestInspectionForMap;
