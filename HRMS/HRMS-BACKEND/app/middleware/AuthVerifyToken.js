const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const User = db.user;

const verifyAuthToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    let token = null;

    if (authorization && authorization.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
    } else if (req.headers["x-access-token"]) {
      token = req.headers["x-access-token"];
    }

    if (!token) {
      return res.status(401).json({
        code: 401,
        status: "failed",
        message: "Unauthorized request, No Token",
      });
    }
    // Verify the token
    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          status: "failed",
          message: "Invalid token" 
        });
      }
      // Fetch the user from the database
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }
      // Attach user to the request and proceed
      req.user = user;
      next();
    });
    } catch (error) {
      console.error("Error in verifyAuthToken:", error);
      res.status(500).json({
        status: "failed",
        message: "Internal Server Error",
      });
    }
  };


module.exports = verifyAuthToken;
