const db = require("../../models");
const { Op } = require("sequelize");

exports.employeeDetail = async (req, res) => {
  try {
    const { entity_id, branch_id } = req.params;

    const getEmployeeData = await db.user.findAll({
      where: {
        location_id: branch_id,
        primary_entity_id: entity_id,
        isDeleted: false,
      },
      attributes: [
        "employee_id",
        "employee_code",
        "first_name",
        "middle_name",
        "last_name",
        "country_code",
        "contact_number",
      ],
    });
    if (!getEmployeeData) {
      return res
        .status(400)
        .send({ code: 400, message: "Record Not Found", data: [] });
    }

    return res.status(200).send({
      code: 200,
      message: "Employee Detail Fetched Successfully",
      data: getEmployeeData,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Server Error:", error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};
