
// const { pool } = require("../db");

// const submitData = async (req, res) => {
//   const objects = req.body; // Assumes the body is an array of objects

//   const insertPromises = objects.map((obj) => {
//     const {
//       projectId,
//       objectId_1,
//       objectId_2,
//       object_type,
//       scadaId,
//       objectId,
//       objectProps,
//       objectLib,
//       status,
//       lat,
//       long,
//       installationDate, // This is now optional
//     } = obj;

//     // Set installationDate to null if not provided
//     const query = `
//       INSERT INTO fpi (project_id, object_id_1, object_id_2, object_type, scada_id, object_id, 
//                       object_props, object_lib, status, lat, long, installation_date, geom)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, ST_SetSRID(ST_MakePoint($10, $11), 4326))
//       RETURNING *;
//     `;

//     // If installationDate is not provided, insert NULL for it
//     return pool.query(query, [
//       projectId,
//       objectId_1,
//       objectId_2,
//       object_type,
//       scadaId,
//       objectId,
//       objectProps,
//       objectLib,
//       status,
//       lat,
//       long,
//       installationDate || null, // Ensure NULL is passed if no installationDate is provided
//     ]);
//   });

//   try {
//     const results = await Promise.all(insertPromises);

//     const insertedRows = results.map((result) => result.rows[0]);

//     res.status(200).json({
//       message: "Data inserted successfully",
//       data: insertedRows,
//     });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Error inserting data", error: err.message });
//   }
// };

// module.exports = submitData;
