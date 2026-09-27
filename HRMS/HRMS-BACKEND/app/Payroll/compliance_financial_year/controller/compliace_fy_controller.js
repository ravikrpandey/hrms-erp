const { where } = require('sequelize');
const db = require('../../../models/index')


exports.createComplianceLimits = async (req, res) => {
  const data = req.body;
  try {

    if (!data) {
      return res.status(400).send({ code: 400, message: "Request body required" });
    }

    let record = await db.ComplianceFY.findOne({ where: { is_deleted: false } });

    if (record) {

      await db.ComplianceFY.update(data, { where: { id: record.id } });
      return res.status(200).send({ code: 200, message: "Compliance updated successfully" });
    } else {
      const savedData = await db.ComplianceFY.create(data);
      return res.status(201).send({ code: 201, message: "Compliance created successfully", data: savedData });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).send({ code: 500, message: "Internal server error", error: err.message });
  }
};


module.exports.getComplianceLimit = async (req, res) => {
  try {

    const data = await db.ComplianceFY.findAll({
      where: { is_deleted: false }
    })
    if (!data) {
      return res.status(404).send({ code: 404, message: "No data found!" })
    }

    return res.status(200).send({ code: 200, message: "Data fetch successfully!", data })

  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Internal server error" })
  }
}