const { pool } = require("../db");

const DeleteInspectionJob = async (req, res) => {
  const { inspection_id } = req.query; // Getting inspection_id from query param

  if (!inspection_id) {
    return res.status(400).json({ message: "inspection_id is required" });
  }

  try {
    // Soft delete logic
    const result = await pool.query(
      `
      UPDATE inspections
      SET is_deleted = 'Y'
      WHERE inspection_id = $1
      RETURNING *;
    `,
      [inspection_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    res.status(200).json({
      message: "Inspection soft-deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error during soft delete:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = DeleteInspectionJob;
