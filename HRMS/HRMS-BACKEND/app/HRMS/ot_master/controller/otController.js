const db = require("../../../models");
const { Op, sequelize } = require("sequelize");

const createOvertime = async (req, res) => {
  const { entity_id, overtimeData } = req.body;

  if (!Array.isArray(overtimeData) || overtimeData.length === 0) {
    return res
      .status(400)
      .json({ message: "overtimeData must be a non-empty array." });
  }

  try {
    const overtimeEntries = overtimeData.map((item) => ({
      ...item,
      entity_id,
      status: "ACTIVE",
      isDeleted: false,
    }));

    const createdRecords = await db.overTime.bulkCreate(overtimeEntries);
    res.status(201).json({
      message: "Overtime data created successfully!",
      data: createdRecords,
    });
  } catch (error) {
    console.error("Error creating overtime records:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllOvertimeData = async (req, res) => {
  let { entity_id } = req.params;

  const requiredFields = ["entity_id"];

  for (const field of requiredFields) {
    if (req.params[field] === undefined || req.params[field] === null) {
      return res.status(400).send({
        message: `OverTime payload is incomplete: ${field} is missing`,
        data: [],
      });
    }
  }

  try {
    const data = await db.overTime.findAll({
      where: {
        [Op.and]: [{ entity_id: entity_id }],
      },
    });
    return res
      .status(200)
      .send({ message: "Data fetched successfully!", data: data });
  } catch (error) {
    return res
      .status(500)
      .send({ message: error.message || "Internal server error!", data: {} });
  }
};

const updateOverTime = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { overtimeData } = req.body;

    if (!entity_id) {
      return res
        .status(400)
        .json({ message: "entity_id is required in params." });
    }

    if (!Array.isArray(overtimeData) || overtimeData.length === 0) {
      return res
        .status(400)
        .json({ message: "overtimeData must be a non-empty array." });
    }

    await db.overTime.destroy({
      where: { entity_id },
    });

    const newEntries = overtimeData.map((item) => ({
      ...item,
      entity_id,
      status: "ACTIVE",
      isDeleted: false,
    }));

    const created = await db.overTime.bulkCreate(newEntries);

    return res.status(200).json({
      message: "Overtime data updated successfully!",
      data: created,
    });
  } catch (error) {
    console.error("Error updating overtime records:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



module.exports = {
  createOvertime,
  getAllOvertimeData,
  updateOverTime,
  
};
