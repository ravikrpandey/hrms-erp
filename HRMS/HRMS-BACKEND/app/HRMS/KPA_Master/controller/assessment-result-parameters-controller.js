const db = require('../../../models/index')
const ResultParamsModel = db.assessment_result_parameters;
const { Op } = require("sequelize");

exports.getAllResultParams = async (req, res) => {
  try {
    const {
      status = "ACTIVE",
      name,
      value,
      minGrade,
      maxGrade,
      description,
      category,
      isDeleted = false,
    } = req.query;

    const whereClause = {
      isDeleted,
    };
    if (status != "all") whereClause.status = status;
    if (name) whereClause.name = name;
    if (value) whereClause.value = value;
    if (category) whereClause.category = category;
    // Handle description (supports partial match if needed)
    if (description) {
      whereClause.description = { [Op.like]: `%${description}%` };
    }

    const records = await ResultParamsModel.findAll({
      where: whereClause,
    });

    if (records.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "All assesment result parameters fetched successfully!",
        data: records,
      });
    } else {
      return res.status(200).send({
        code: 404,
        message: "No assesment result parameters found",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};
exports.createResultParams = async (req, res) => {
  try {
    const {
      status = "ACTIVE",
      name,
      value,
      minGrade,
      maxGrade,
      description,
      category,
      isDeleted = false,
    } = req.body;

    if (!name || !description || !status || !description ) {
      return res
        .status(400)
        .send({ code: 400, message: "All fields are required!" });
    }
    const hasValue = value !== undefined && !isNaN(+value);
    const hasMinMax = !isNaN(+minGrade) && !isNaN(+maxGrade);
      
    // Validate value OR (minGrade AND maxGrade)
    if (!hasValue && !hasMinMax) {
        return res.status(400).send({
            code: 400,
            message: "Either 'value' or both 'minGrade' and 'maxGrade' are required.",
        });
    }
    const record = await ResultParamsModel.findOne({
      where: {
        name: name,
        isDeleted: false,
      },
    });
    if (record) {
      return res
        .status(400)
        .send({ code: 400, message: "Dublicate name for grade!" });
    }

    const newRecord = await ResultParamsModel.create({
      name: name.trim(),
      description,
      value,
      minGrade,
      maxGrade,
      status,
      category: category?.trim() || null,
      isDeleted,
    });

    return res.status(201).send({
      code: 201,
      message: "Result parameter created successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};
exports.getOneResultParams = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing assesment result parameter id." });
    }
    const record = await ResultParamsModel.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    return res.status(200).send({
      code: 200,
      message: "Success",
      data: record,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};
exports.updateResultParams = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .send({ code: 400, message: "No update provided!" });
    }
    if (
       isNaN(Number(updates.minGrade))||
        isNaN(Number(updates.maxGrade)) ||
        isNaN(Number(updates.value))
    ) {
      return res
        .status(400)
        .send({ code: 400, message: "Provide valid value for number fields" });
    }
    const existingRecord = await ResultParamsModel.findByPk(id);
    if (!existingRecord) {
      return res.status(404).send({ code: 404, message: "Record not found" });
    }

    // Check for duplicate name if name is being updated
    if (updates.name) {
      updates.name = updates.name.trim();
    }
    if (updates.name && updates.name !== existingRecord.name) {
      const existingRecords = await ResultParamsModel.findOne({
        where: { name: updates.name.trim(), isDeleted: false },
      });
      if (existingRecords) {
        return res.status(400).send({
          code: 400,
          message: "Duplicate name! Please try with a different name.",
        });
      }
    }

    // Apply updates
    Object.assign(existingRecord, updates);
    await existingRecord.save();

    return res.status(200).send({
      code: 201,
      message: "update success",
      data: existingRecord,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};
exports.deleteResultParams = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing assesment result parameter id." });
    }
    const deletedRecord = await ResultParamsModel.update(
      {
        isDeleted: true,
        status: "INACTIVE",
      },
      {
        where: { id },
      }
    );
    return res.status(200).send({
      code: 200,
      message: "Delete Successfull!",
      id: id,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};
exports.myResultAssesment = async(req, res) => {
  try {
    const result = await db.assessment_result_parameters.findAll({
      where: {
        status: 'ACTIVE',
        isDeleted: false,
        department_id: departmentId, // replace with actual department_id
        [Op.or]: [
          { value: employeePerformanceResult },
          {
            [Op.and]: [
              { minGrade: { [Op.lte]: employeePerformanceResult } },
              { maxGrade: { [Op.gte]: employeePerformanceResult } },
            ]
          }
        ]
      }
    });
    
  } catch (error) {
    console.log(error)
  }
}
