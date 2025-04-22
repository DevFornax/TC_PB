const { pool } = require("../../db");

const getProjectData = async (req, res) => {
  try {
   
    const { id, method } = req.body;

    if (!id || !method) {
      return res.status(400).json({ message: "ID and method are required" });
    }

    if (method === "project") {
    
      const result = await pool.query(
        `SELECT * 
         FROM public.location_dgv 
         WHERE project_id = $1`, 
        [id]
      );

   
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "No locations found for this project." });
      }


      res.status(200).json({ locations: result.rows });
    } else if (method === "location") {
  
      const locationResult = await pool.query(
        `SELECT project_id 
         FROM public.location_dgv 
         WHERE id = $1`, 
        [id]
      );

     
      if (locationResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "No location found with this ID." });
      }

      const projectId = locationResult.rows[0].project_id;

      
      const projectLocations = await pool.query(
        `SELECT * 
         FROM public.location_dgv
         WHERE project_id = $1`,
        [projectId]
      );

      
      res.status(200).json({ locations: projectLocations.rows });
    } else {
      return res.status(400).json({ message: "Invalid method" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = getProjectData;
