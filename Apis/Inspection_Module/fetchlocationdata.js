

// const { pool } = require("../db");

// const checkLocationById = async (req, res) => {
//   try {
//     const { location_id } = req.body;

//     if (!location_id) {
//       return res.status(400).json({ error: "location_id is required" });
//     }


//     const locationQuery = `SELECT * FROM location WHERE id = $1;`;
//     const locationResult = await pool.query(locationQuery, [location_id]);

//     if (locationResult.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No location found with that ID" });
//     }

//     const location = locationResult.rows[0];

//     // 2. Get Project
//     const projectQuery = `
//       SELECT project_name, category, system_kv, substation_id
//       FROM project
//       WHERE project_id = $1;
//     `;
//     const projectResult = await pool.query(projectQuery, [location.project_id]);

//     if (projectResult.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "Project not found for this location" });
//     }

//     const project = projectResult.rows[0];

//     // 3. Get Substation
//     const substationQuery = `SELECT ss_name FROM sub_station WHERE ss_id = $1;`;
//     const substationResult = await pool.query(substationQuery, [
//       project.substation_id,
//     ]);

//     const substation_name =
//       substationResult.rows.length > 0
//         ? substationResult.rows[0].ss_name
//         : null;

//     // 4. Format Response
//     const {
//       id,
//       parent_id,
//       project_id,
//       geom,
//       lat,
//       lng,
//       point_props,
//       line_props,
//       ...rest
//     } = location;

// const numericId = id ? parseInt(id) : null;
// const numericParentId = parent_id ? parseInt(parent_id) : null;
// const numericProjectId = project_id ? parseInt(project_id) : null;
// const numericSubstationId = project.substation_id
//   ? parseInt(project.substation_id)
//   : null;

//     const formatted = {
//       id: numericId,
//       parent_id: numericParentId,
//       project_id: numericProjectId,
//       project_name: project.project_name,
//       substation_id: numericSubstationId,
//       substation_name,
//       attributes: {
//         ...rest,
//         geom,
//         lat,
//         lng,
//         point_props: parseSafeJSON(point_props),
//         line_props: parseSafeJSON(line_props),
//       },
//     };

//     return res.status(200).json(formatted);
//   } catch (error) {
//     console.error("Error checking location by ID:", error);
//     return res
//       .status(500)
//       .json({ error: `Internal server error: ${error.message}` });
//   }
// };


// function parseSafeJSON(str) {
//   try {
//     return str ? JSON.parse(str) : null;
//   } catch (e) {
//     return null;
//   }
// }

// module.exports = checkLocationById;





const { pool } = require("../../db");

const checkLocationById = async (req, res) => {
  try {
    const { location_id } = req.body;

    if (!location_id) {
      return res.status(400).json({ error: "location_id is required" });
    }

    const locationQuery = `SELECT * FROM location_dgv WHERE id = $1;`;
    const locationResult = await pool.query(locationQuery, [location_id]);

    if (locationResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No location found with that ID" });
    }

    const location = locationResult.rows[0];

    const projectQuery = `
      SELECT project_name, category, system_kv, substation_id
      FROM project
      WHERE project_id = $1;
    `;
    const projectResult = await pool.query(projectQuery, [location.project_id]);

    if (projectResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Project not found for this location" });
    }

    const project = projectResult.rows[0];


    const substationQuery = `SELECT ss_name FROM sub_station WHERE ss_id = $1;`;
    const substationResult = await pool.query(substationQuery, [
      project.substation_id,
    ]);

    const substation_name =
      substationResult.rows.length > 0
        ? substationResult.rows[0].ss_name
        : "NA"; 

    
    const {
      id,
      parent_id,
      project_id,
      geom,
      lat,
      lang,
      location_type,
      point_props,
      line_props,
      ...rest
    } = location;

    const numericId = id ? parseInt(id) : null;
    const numericParentId = parent_id ? parseInt(parent_id) : null;
    const numericProjectId = project_id ? parseInt(project_id) : null;
    const numericSubstationId = project.substation_id
      ? parseInt(project.substation_id)
      : null;

    const formatted = {
      id: numericId,
      parent_id: numericParentId,
      location_name :location.location_name,
      project_id: numericProjectId,
      project_name: project.project_name || "NA", 
      substation_id: numericSubstationId,
      substation_name: substation_name,
      attributes: {
        p_key: "NA", 
        fid: null, 
        data_type: "ht_location", 
        point_type: location.location_type,
        point_no: location.point_no || "NA",
        area_code: location.area_code || "NA",
        ulid: location.ulid || "NA", 
        qrc_text: location.qrc_text || "NA",
        qrc_by: location.qrc_by || "NA", 
        qrc_at: location.qrc_at || "NA", 
        data_source: location.data_source || "NA", 
        created_by: location.created_by || "NA", 
        updated_by: location.updated_by || "NA", 
        created_at: location.created_at || "NA", 
        updated_at: location.updated_at || "NA", 
        deleted_at: location.deleted_at || "NA", 
        network_type: location.network_type || "NA", 
        geom: geom || "NA",
        lat: lat || "NA", 
        lng: lang || "NA", 
        point_props: parseSafeJSON(point_props) || { support_type: "NA" }, 
        line_props: parseSafeJSON(line_props) || { position: "NA" },
      },
    };

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error checking location by ID:", error);
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

function parseSafeJSON(str) {
  try {
    return str ? JSON.parse(str) : null;
  } catch (e) {
    return null;
  }
}

module.exports = checkLocationById;
