const db = require("../../../models/index");
const Sequelize = require("sequelize");
const ServiceMaster = db.Service_master;
const Service_Category = db.ServicesCategory;
const logger = require("../../../../logger/index");

exports.createServiceMaster = async (req, res) => {
  try {
    let {
      service_code,
      chart_of_account_id,
      service_name,
      service_description,
      cgst,
      sgst,
      igst,
      sac_code_id,
      entity_id,
    } = req.body;
    cgst = cgst ? parseFloat(cgst) : null;
    sgst = sgst ? parseFloat(sgst) : null;
    igst = igst ? parseFloat(igst) : null;

    const existsCahrtOfAccount = await db.Service_master.findOne({
      where: { chart_of_account_id: chart_of_account_id, isDeleted: 0 },
    });
    if (existsCahrtOfAccount) {
      return res.status(400).send({
        code: 400,
        message: "Chart of account already mapped choose another account",
      });
    }

    const createData = await db.Service_master.create({
      service_code,
      service_name,
      service_description,
      cgst,
      sgst,
      igst,
      chart_of_account_id,
      sac_code_id,
      entity_id,
    });
    return res.status(200).send({
      code: 200,
      message: "Service Created Successfully",
      data: createData,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const { entity_id } = req.query;
    const [serviceData] = await db.sequelize
      .query(`SELECT S.* ,M.hsn_sac_code AS service_code,S.igst AS tax
FROM MASTER_SERVICE AS S
INNER JOIN MASTER_HSN_SAC_CODE AS M ON M.id=S.sac_code_id
WHERE S.entity_id=${entity_id}`);
    if (serviceData) {
      return res.status(200).send({
        code: 200,
        message: "Get All Service data successfully",
        data: serviceData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Data found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });

    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getServicesById = async (req, res) => {
  try {
    const [serviceData] = await db.sequelize
      .query(`SELECT S.* ,M.hsn_sac_code AS service_code
            FROM MASTER_SERVICE AS S
            INNER JOIN MASTER_HSN_SAC_CODE AS M ON M.id=S.sac_code_id
            WHERE S.service_id=${req.params.id}`);
    if (serviceData) {
      return res.status(200).send({
        code: 200,
        message: "Get Service data successfully",
        data: serviceData[0],
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Data found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.update_services = async (req, res) => {
  try {
    const id = req.params.id;

    let {
      service_code,
      chart_of_account_id,
      service_name,
      service_description,
      cgst,
      sgst,
      igst,
      sac_code_id,
      entity_id,
    } = req.body;
    cgst = cgst ? parseFloat(cgst) : null;
    sgst = sgst ? parseFloat(sgst) : null;
    igst = igst ? parseFloat(igst) : null;

    const updateData = await ServiceMaster.update(
      {
        service_code,
        service_name,
        service_description,
        cgst,
        sgst,
        igst,
        chart_of_account_id,
        sac_code_id,
        entity_id,
      },
      {
        where: { service_id: id },
      },
    );
    return res.status(200).send({
      code: 200,
      message: "Service updated Successfully!",
      data: updateData,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.deleteServices = async (req, res) => {
  try {
    const id = req.params.id;
    const getAllData = await ServiceMaster.findOne({
      where: { service_id: id },
    });
    if (getAllData) {
      await ServiceMaster.update(
        { isDeleted: true },
        { where: { service_id: id } },
      );
      return res
        .status(200)
        .send({ code: 200, message: "Service is Deleted Successfully!" });
    } else {
      return res.status(404).send({ code: 403, message: "Data not found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.updateServiceStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const editData = await ServiceMaster.findOne({ where: { service_id: id } });
    if (editData) {
      const updateData = await ServiceMaster.update(
        {
          status,
        },
        { where: { service_id: id } },
      );
      return res.status(200).send({
        code: 200,
        message: "Status Updated Successfully",
        data: updateData,
      });
    } else {
      return res.status(400).send({ code: 400, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getSacCode = async (req, res) => {
  try {
    let entity_id = req.params?.id;
    const [query] = await db.sequelize
      .query(`SELECT MHSC.*,GRM.value FROM MASTER_HSN_SAC_CODE AS MHSC 
            LEFT JOIN GST_RATE_MASTER AS GRM ON GRM.id = MHSC.gst_rate_id
            WHERE MHSC.code_type = 'SAC' AND MHSC.entity_id = ${entity_id} AND MHSC.isDeleted = 0`);

    if (query.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched Data Successfully !",
        data: query,
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: query });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.getHSNCode = async (req, res) => {
  try {
    let entity_id = req.params?.id;
    let { code_type } = req.query;
    if (code_type === "SAC") {
      code_type = "SAC";
    } else {
      code_type = "HSN";
    }
    const [query] = await db.sequelize
      .query(`SELECT MHSC.*,GRM.value FROM MASTER_HSN_SAC_CODE AS MHSC 
            LEFT JOIN GST_RATE_MASTER AS GRM ON GRM.id = MHSC.gst_rate_id
            WHERE MHSC.code_type = "${code_type}" AND MHSC.entity_id = ${entity_id} AND MHSC.isDeleted = 0`);

    if (query.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched Data Successfully !",
        data: query,
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: query });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.createServiceChartOfAccount = async (req, res) => {
  try {
    const { entity_id, chart_account_id } = req.body;

    const dataList = await db.Service_master.findAll({ where: { entity_id } });
    await Promise.all(
      dataList.map(async (i) => {
        await db.Service_master.update(
          { chart_of_account_id: chart_account_id },
          { where: { entity_id } },
        );
      }),
    );
    return res.status(200).send({ code: 200, message: "Successfully updated" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};
