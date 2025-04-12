const { pool } = require("../db");

const getInspactionRecords = async (req, res) => {
  const { page = 1, limit = 50 } = req.body; 
  const offset = (page - 1) * limit;

  try {
    const totalCountResult = await pool.query(
      `SELECT COUNT(*) FROM inspections`
    );
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const result = await pool.query(
      `SELECT * FROM inspections
       ORDER BY id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.status(200).json({
      total: totalCount,
      page,
      limit,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching inspections:", error);
    return res.status(500).json({
      error: `Internal server error: ${error.message}`,
    });
  }
};
module.exports = getInspactionRecords;