const db = require("../../models/index");

const Grade = db.grade_master;
const Op = db.Sequelize.Op;

// Create a new grade
exports.createGrade = async (req, res) => {
  try {
    const { grade_name, entity_id } = req.body;
    const gradedata = await Grade.findOne({
      where: { grade_name, entity_id, isDeleted: 0 },
    });
    if (gradedata) {
      return res
        .status(201)
        .send({ code: 201, message: "Grade already exists!" });
    }
    const gradeData = await Grade.create({
      grade_name,
      entity_id,
    });
    return res
      .status(200)
      .send({ code: 200, message: "Created successfully", data: gradeData });
  } catch (err) {
    return res.status(500).send({ code: 500, message: "Server error" });
  }
};

// Get a list of grades
exports.gradeList = async (req, res) => {
  try {
    const { entity_id } = req.query;
    const gradeData = await Grade.findAll({
      where: { isDeleted: false, entity_id },
      attributes: ["grade_id", "grade_name", "status"],
      order: [["grade_id", "DESC"]],
    });
    if (gradeData) {
      res.status(200).send({
        message: "Grade data list fetched successfully",
        data: gradeData,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).send({ message: "Error", error: err.message });
  }
};

// Get grade details
exports.gradeDetails = async (req, res) => {
  const grade_id = parseInt(req.params.grade_id);
  try {
    const gradeData = await Grade.findOne({
      where: { grade_id },
      attributes: ["grade_id", "grade_name", "status"],
    });
    if (gradeData) {
      res.status(200).send({
        message: "Grade details fetched successfully",
        data: gradeData,
      });
    }
  } catch (err) {
    res.status(400).send({ message: "Error", error: err.message });
  }
};

// Update grade details
exports.gradeUpdate = async (req, res) => {
  try {
    const grade_id = parseInt(req.params.grade_id);
    const { grade_name } = req.body;
    const gradeDetails = await Grade.findOne({ where: { grade_id } });
    if (gradeDetails) {
      const gradeExists = await Grade.findOne({
        where: { grade_name, grade_id: { [db.Sequelize.Op.ne]: grade_id } },
      });
      if (gradeExists) {
        return res
          .status(409)
          .send({ code: 409, message: "Grade already exists!" });
      } else {
        const gradeData = await Grade.update(req.body, {
          where: { grade_id },
        });
        return res
          .status(200)
          .send({ message: "Grade updated successfully", data: gradeData });
      }
    } else {
      return res.status(403).send({ code: 403, message: "Record not found" });
    }
  } catch (err) {
    return res.status(500).send({ code: 500, message: "Server error" });
  }
};

// Update grade status
exports.updateGradeStatus = async (req, res) => {
  try {
    const grade_id = parseInt(req.params.grade_id);
    const { status } = req.body;
    const editData = await Grade.findOne({ where: { grade_id } });
    if (editData) {
      const updateData = await Grade.update(
        { status },
        { where: { grade_id } }
      );
      return res.status(200).send({
        code: 200,
        message: "Status updated successfully!",
        data: updateData,
      });
    } else {
      return res.status(400).send({ code: 400, message: "Record not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error!" });
  }
};

// Soft delete a grade
exports.deleteGradeById = async (req, res) => {
  const grade_id = parseInt(req.params.grade_id);
  try {
    const gradeDetails = await Grade.findOne({ where: { grade_id } });
    if (gradeDetails) {
      const gradeData = await Grade.update(
        { isDeleted: true },
        {
          where: { grade_id },
        }
      );
      return res
        .status(200)
        .send({ code: 200, message: "Deleted successfully!", data: gradeData });
    } else {
      return res.status(403).send({ code: 403, message: "Record not found!" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error!" });
  }
};

/** get all active grade list */
// Get a list of grades
exports.getActiveGradeList = async (req, res) => {
  try {
    const { entity_id } = req.query;
    const gradeData = await Grade.findAll({
      where: { isDeleted: false, entity_id, status: "ACTIVE" },
      attributes: ["grade_id", "grade_name", "status"],
      order: [["grade_id", "DESC"]],
    });
    if (gradeData) {
      res.status(200).send({
        message: "Data fetched successfully!",
        data: gradeData,
      });
    }
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send({ message: "Internal server error!", error: err.message });
  }
};

exports.getGradeListByBranch = async (req, res) => {
  // try {
  //   const { entity_id, branch_id, financial_id } = req.query;
  //   const gradeData = await db.sequelize.query(
  //     `SELECT pst.grade, pst.status,mg.grade_id, mg.grade_name
  //      FROM PAYROLL_SALARY_TEMPLATE AS pst
  //      LEFT JOIN MASTER_GRADE AS mg ON pst.grade = mg.grade_id
  //      WHERE pst.is_deleted = false
  //        AND pst.entity_type = :entity_id
  //        AND pst.financial_year = :financial_id
  //        AND pst.branch = :branch_id
  //        AND pst.status = 'ACTIVE'
  //      ORDER BY pst.grade ASC;`,
  //     {
  //       replacements: { entity_id, branch_id, financial_id },
  //       type: db.Sequelize.QueryTypes.SELECT
  //     }
  //   );
  //   if (gradeData.length > 0) {
  //     res.status(200).send({ code: 200, message: "Grade data list fetched successfully", data: gradeData });
  //   } else {
  //     res.status(200).send({ code: 200, message: "No grade data found" , data: [] });
  //   }
  // } catch (err) {
  //   console.log(err.message);
  //   res.status(400).send({ message: "Error", error: err.message });
  // }
};
