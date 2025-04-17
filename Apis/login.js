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



// const { pool } = require("../db");
// const jwt = require("jsonwebtoken");

// const LoginApi = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const result = await pool.query("SELECT * FROM users_tc WHERE username = $1", [
//       username,
//     ]);

//     if (result.rows.length === 0) {
//       return res
//         .status(401)
//         .json({ success: false, message: "User not found" });
//     }

//     const user = result.rows[0];

//     // 🚫 No bcrypt — direct match
//     if (user.password !== password) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid password" });
//     }

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

const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 600000; 
const attemptTracker = new Map(); 

const LoginApi = async (req, res) => {
  try {
    const { username, password } = req.body;

  
    const key = `${username}`;

    const attemptInfo = attemptTracker.get(key) || { count: 0, lastFail: null };
    const now = Date.now();

    if (
      attemptInfo.count >= MAX_ATTEMPTS &&
      attemptInfo.lastFail &&
      now - attemptInfo.lastFail < LOCK_DURATION
    ) {
      const wait = Math.ceil(
        (LOCK_DURATION - (now - attemptInfo.lastFail)) / 1000
      );
      return res.status(403).json({
        success: false,
        message: `Account locked due to too many failed attempts. Try again in ${wait} seconds.`,
      });
    }

    const result = await pool.query(
      "SELECT * FROM users_tc WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];

    
    if (user.password !== password) {
      attemptTracker.set(key, {
        count: attemptInfo.count + 1,
        lastFail: now,
      });

      const attemptsLeft = MAX_ATTEMPTS - (attemptInfo.count + 1);
      return res.status(401).json({
        success: false,
        message:
          attemptsLeft > 0
            ? `Invalid password. ${attemptsLeft} attempt(s) left.`
            : "Account temporarily locked. Please try again later.",
      });
    }

    attemptTracker.delete(key);

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
