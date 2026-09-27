const db = require("../../../models");
const config = require("../../../config/auth.config");
const emailVarify = require("../../../utils/validation");
const transport = require('../../../master/services/nodemailer')
const User = db.user;




exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};


exports.usersTest=(req,res)=>{
res.status(200).send("UserTestcontent.")
};

exports.officeLocation=(req,res)=>{
  res.status(200).send("UserTestcontent.")
  };
exports.leaveType=(req,res)=>{
res.status(200).send("UserTestcontent.")
    };

exports.getChildEmployee = async (req, res) => {
  try {
    // Input validation
    const { emId } = req.params;
    if (!emId || isNaN(parseInt(emId))) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or missing employee ID",
      });
    }

    // Query employees with specific attributes and proper error handling
    const users = await db.user.findAll({
      where: { reporting_manager_id: parseInt(emId) },
      attributes: ["employee_id", "first_name", "last_name"], // Select only needed fields
      raw: true, // Optimize by returning plain objects
    });

    // Check if any employees were found
    if (!users || users.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No employees found for this manager",
      });
    }

    // Return success response
    return res.status(200).json({
      status: "success",
      data: users,
      count: users.length,
    });
  } catch (error) {
    // Log error for debugging (in a production environment, use a proper logging service)
    console.error("Error in getChildEmployee:", error.message);

    // Return detailed error response
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};