// const { pool } = require("../db");

// const getInspactionRecords = async (req, res) => {
//   const { page = 1, limit = 50 } = req.body;
//   const offset = (page - 1) * limit;

//   try {
//     const totalCountResult = await pool.query(
//       `SELECT COUNT(*) FROM inspections WHERE is_deleted IS DISTINCT FROM 'Y'`
//     );
//     const totalCount = parseInt(totalCountResult.rows[0].count);

//     const result = await pool.query(
//       `
//       SELECT
//         i.*,
//         p.project_name,
//         p.substation_id::INTEGER,  -- force substation_id to be number
//         s.ss_name AS substation_name
//       FROM inspections i
//       LEFT JOIN public.project p ON i.project_id = p.project_id
//       LEFT JOIN public.sub_station s ON p.substation_id = s.ss_id
//       WHERE i.is_deleted IS DISTINCT FROM 'Y'
//       ORDER BY i.id DESC
//       LIMIT $1 OFFSET $2
//       `,
//       [limit, offset]
//     );

//     return res.status(200).json({
//       total: totalCount,
//       page,
//       limit,
//       data: result.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching inspections:", error);
//     return res.status(500).json({
//       error: `Internal server error: ${error.message}`,
//     });
//   }
// };

// module.exports = getInspactionRecords;

const { pool } = require("../../db");

const getInspactionRecords = async (req, res) => {
  const { page = 1, limit = 50 } = req.body;
  const offset = (page - 1) * limit;

  try {
    const totalCountResult = await pool.query(
      `SELECT COUNT(*) FROM inspections WHERE is_deleted IS DISTINCT FROM 'Y'`
    );
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const result = await pool.query(
      `
      SELECT 
        i.*, 
        p.project_name, 
        p.substation_id::INTEGER,  -- force substation_id to be a number
        s.ss_name AS substation_name,
        l.lat, 
        l.lang 
      FROM inspections i
      LEFT JOIN public.project p ON i.project_id = p.project_id
      LEFT JOIN public.sub_station s ON p.substation_id = s.ss_id
      LEFT JOIN public.location_dgv l ON i.location_id = l.id  -- Join with location_dgv to get lat/lon
      WHERE i.is_deleted IS DISTINCT FROM 'Y'
      ORDER BY i.id DESC
      LIMIT $1 OFFSET $2
      `,
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
