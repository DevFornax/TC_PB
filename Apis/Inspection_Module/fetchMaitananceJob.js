const { pool } = require("../../db");

const fetchMaintananceJob = async (req, res) => {
  try {
    const query = `
      SELECT * FROM maintenance_master
      ORDER BY task_id ASC
    `;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found in the master table." });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching all tasks:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = fetchMaintananceJob;
