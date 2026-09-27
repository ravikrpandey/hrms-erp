const db = require("../../../models/index");
const ZoneType = db.zoneType;       // <-- Correct model reference
const logger = require("../../../../logger/index");

// CREATE
exports.createZoneType = async (req, res) => {
  try {
    const { zone_type } = req.body;

    // Check Duplicate (only active records)
    const exists = await ZoneType.findOne({
      where: {
        zone_type: zone_type.trim(),
        isDeleted: false
      }
    });

    if (exists) {
      return res.status(409).send({
        code: 409,
        message: "Zone Type already exists!"
      });
    }

    const created = await ZoneType.create({
      zone_type: zone_type.trim(),
      isDeleted: false,
      status: true
    });

    return res.status(201).send({
      code: 201,
      message: "Zone Type created successfully",
      data: created
    });

  } catch (error) {
    console.error("Create ZoneType Error:", error);
    return res.status(500).send({
      code: 500,
      message: "Server Error"
    });
  }
};


// GET ALL
exports.getAllZoneTypes = async (req, res) => {
  try {
    const list = await ZoneType.findAll({
      where: { isDeleted: false },
      order: [['id', 'DESC']]
    });

    return res.status(200).send({
      code: 200,
      message: "Zone Types fetched successfully",
      data: list
    });

  } catch (error) {
    logger.error("Get ZoneTypes Error:", error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

// GET BY ID
exports.getZoneTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const zone = await ZoneType.findOne({
      where: { id, isDeleted: false }
    });

    if (!zone) {
      return res.status(404).send({ code: 404, message: "Zone Type not found" });
    }

    return res.status(200).send({
      code: 200,
      message: "Zone Type fetched successfully",
      data: zone
    });

  } catch (error) {
    logger.error("Get ZoneType By ID Error:", error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

// UPDATE
exports.updateZoneType = async (req, res) => {
  try {
    const { id } = req.params;
    const { zone_type, status } = req.body;

    const zone = await ZoneType.findOne({
      where: { id, isDeleted: false }
    });

    if (!zone) {
      return res.status(404).send({ code: 404, message: "Zone Type not found" });
    }

    await zone.update({ zone_type, status });

    return res.status(200).send({
      code: 200,
      message: "Zone Type updated successfully",
      data: zone
    });

  } catch (error) {
    logger.error("Update ZoneType Error:", error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

// DELETE (SOFT DELETE)
exports.deleteZoneType = async (req, res) => {
  try {
    const { id } = req.params;

    const zone = await ZoneType.findOne({
      where: { id, isDeleted: false }
    });

    if (!zone) {
      return res.status(404).send({ code: 404, message: "Zone Type not found" });
    }

    await zone.update({ isDeleted: true, status: "INACTIVE" });

    return res.status(200).send({
      code: 200,
      message: "Zone Type deleted successfully"
    });

  } catch (error) {
    logger.error("Delete ZoneType Error:", error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};
