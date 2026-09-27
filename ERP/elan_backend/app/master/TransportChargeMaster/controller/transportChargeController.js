const db = require("../../../models/index");

module.exports.createTransportCharge = async (req, res) => {
  try {

    const {charge_name} = req.body;

    if (!charge_name) {
      return res.status(400).json({
        success: false,
        message: "Charge Name is required."
      });
    }

    const exists = await db.transportChargeMst.findOne({
      where: {
        charge_name,
        is_deleted: false
      }
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Charge Name already exists."
      });
    }

    const data = await db.transportChargeMst.create({charge_name});

    return res.status(201).json({
      success: true,
      message: "Transport Charge created successfully.",
      data
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message
    });

  }
};

module.exports.getTransportChargeList = async (req, res) => {
  try {

    const data = await db.transportChargeMst.findAll({where: {is_deleted: false},order: [["id", "DESC"]]});

    return res.status(200).json({
      success: true,
      message: "Transport Charge List fetched successfully.",
      count: data.length,
      data
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message
    });

  }
};
module.exports.getTransportChargeById = async (req, res) => {
  try {

    const data = await db.transportChargeMst.findOne({where: {is_deleted: false,id:req.params.id}});

    return res.status(200).json({
      success: true,
      message: "Transport Charge fetched successfully.",      
      data
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message
    });

  }
};
const { Op } = require("sequelize");

module.exports.updateTransportCharge = async (req, res) => {
  try {
    const { id } = req.params;

    const {charge_name} = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transport Charge Id is required.",
      });
    }

    
    const transportCharge = await db.transportChargeMst.findOne({
      where: {
        id,
        is_deleted: false,
      },
    });

    if (!transportCharge) {
      return res.status(404).json({
        success: false,
        message: "Transport Charge not found.",
      });
    }

    const duplicate = await db.transportChargeMst.findOne({where: {charge_name,id: {[Op.ne]: id,},is_deleted: false,},});

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Charge Name already exists.",
      });
    }

    await transportCharge.update({charge_name,});

    return res.status(200).json({
      success: true,
      message: "Transport Charge updated successfully.",
      data: transportCharge,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};