// const { pool } = require("../db");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const LoginApi = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Get user from DB
//     const result = await pool.query("SELECT * FROM users WHERE username = $1", [
//       username,
//     ]);

//     if (result.rows.length === 0) {
//       return res
//         .status(401)
//         .json({ success: false, message: "User not found" });
//     }

//     const user = result.rows[0];

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid password" });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user.id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         first_name: user.first_name,
//         last_name: user.last_name,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// module.exports = LoginApi;



const { pool } = require("../db");
const jwt = require("jsonwebtoken");

const LoginApi = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query("SELECT * FROM users_tc WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];

    // 🚫 No bcrypt — direct match
    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = LoginApi;

