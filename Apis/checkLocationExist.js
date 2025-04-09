const { pool } = require("../db");

const checkLocationExist = async (req, res) => {
  try {
    const { location_id } = req.body;

    if (!location_id) {
      return res.status(400).json({ error: "Location ID is required" });
    }

    const query = `
      SELECT id FROM location
      WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [location_id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: "not_found" });
    }

    return res.status(200).json({ id: rows[0].id, status: "exists" });
  } catch (error) {
    console.error("Error checking location by ID:", error);
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

module.exports = checkLocationExist;
