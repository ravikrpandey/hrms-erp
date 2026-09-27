const db = require("../../../models/index");
const branch = db.tbl_branch;
const logger = require("../../../../logger/index");

exports.create_Branch = async (req, res) => {
  try {
    const {
      branch_name,
      branch_contact_person_name,
      branch_contact_no,
      contact_no,
      branch_email,
      branch_alt_email,
      pan_number,
      reverse_charge_applicable,
      gst_composition_scheme,
      branch_gstnumber,
      branch_pin_code,
      gst_lut_bond,
      gst_filing_cycle,
      e_wayBill,
      sez_registration,
      eway_amount,
      type_gst_registration,
      branch_address,
      city_id,
      country_id,
      state_id,
      status,
      billing_status,
      alt_country_code,
      country_code,
      branch_contact_detail,
      branch_alt_contact_detail,
    } = req.body;
    const branch_code = btoa(Math.random()).slice(0, 10).toUpperCase();
    const user = await branch.findOne({
      where: { branch_name: branch_name, isDeleted: false },
    });
    if (user) {
      return res
        .status(403)
        .send({ code: 403, message: "Branch  Already Exists" });
    } else if (!user) {
      const response = await branch.create({
        branch_name,
        branch_code,
        branch_contact_person_name,
        branch_contact_no,
        contact_no,
        branch_email,
        pan_number,
        e_wayBill,
        sez_registration,
        eway_amount,
        reverse_charge_applicable,
        gst_composition_scheme,
        gst_lut_bond,
        gst_filing_cycle,
        type_gst_registration,
        branch_gstnumber,
        branch_pin_code,
        branch_alt_email,
        branch_address,
        city_id,
        country_id,
        state_id,
        status,
        billing_status,
        alt_country_code,
        country_code,
        branch_contact_detail,
        branch_alt_contact_detail,
      });
      return res.status(200).send({
        code: 200,
        message: "Branch Created Successfully!",
        data: response,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getAllBranch = async (req, res) => {
  try {
    const branchNames = await db.tbl_branch.findAll({
      attributes: ["id", "branch_name", "branch_code", "status"],
      where: {
        isDeleted: 0,
      },
      order: [["branch_name", "ASC"]],
    });

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully.",
      data: branchNames,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message:
        "An error occurred while fetching the data. Please try again later.",
    });
  }
};

exports.branch_get = async (req, res) => {
  try {
    const { id } = req.params;

    const whereCondition = {
      isDeleted: false,
    };

    if (id) {
      whereCondition.id = id;
    }
    const data = await branch.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
      include: [
        {
          model: db.countryss,
          attributes: ["countryss_id", "countryss_name"],
        },
        {
          model: db.states,
          attributes: ["states_id", "states_name", "states_code"],
        },
        {
          model: db.city,
          attributes: ["city_id", "city_name"],
          required: false,
        },
      ],
    });

    if (id) {
      if (data.length > 0) {
        return res.status(200).send({
          code: 200,
          message: "Get Branch Data Successfully..",
          data: data[0],
        });
      } else {
        return res
          .status(404)
          .send({ code: 404, message: "No Data found for the provided ID" });
      }
    } else {
      return res.status(200).send({
        code: 200,
        message: "Get All Branch Data Successfully",
        data: data,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getBranch = async (req, res) => {
  try {
    // const { id } = req.params;

    // const whereCondition = {
    //     isDeleted: false
    // };

    // if (id) {
    //     whereCondition.id = id;
    // }
    const data = await branch.findAll({
      where: { isDeleted: false, billing_status: true },
      order: [["id", "DESC"]],
      include: [
        {
          model: db.countryss,
          attributes: ["countryss_id", "countryss_name"],
        },
        {
          model: db.states,
          attributes: ["states_id", "states_name"],
        },
        {
          model: db.city,
          attributes: ["city_id", "city_name"],
          required: false,
        },
      ],
    });

    if (data.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Branch Data Successfully",
        data: data,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.branch_get_active = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeletedCondition = `WHERE T.isDeleted = false AND T.status = 'ACTIVE'`;
    const query = `SELECT T.id, T.branch_name, T.branch_code, T.branch_contact_person_name, T.branch_contact_no,
                    T.contact_no, T.branch_email, T.branch_alt_email, T.branch_address, T.status AS branch_status,T.billing_status,T.alt_country_code, T.country_code AS phone_country_code,
                    T.status, CT.*, S.states_id AS branch_states_id ,S.*, C.*  FROM MASTER_BRANCH AS T
                    LEFT JOIN MASTER_COUNTRY AS CT ON T.country_id = CT.countryss_id
                    LEFT JOIN MASTER_STATE AS S ON T.state_id = S.states_id
                    LEFT JOIN MASTER_CITY AS C ON T.city_id = C.city_id 
                    ${isDeletedCondition}
                    ${id ? "AND T.id = :id" : ""} 
                   ORDER BY T.id DESC`;

    const data = await db.sequelize.query(query, {
      replacements: { id: id, isDeleted: false },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (id) {
      if (data.length > 0) {
        return res.status(200).send({
          code: 200,
          message: "Get Branch Data Successfully",
          data: data[0],
        });
      } else {
        return res
          .status(404)
          .send({ code: 404, message: "No Data found for the provided ID" });
      }
    } else {
      return res.status(200).send({
        code: 200,
        message: "Get All Branch Data Successfully",
        data: data,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.update_branch = async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const {
        branch_name,
        branch_contact_person_name,
        branch_contact_no,
        branch_email,
        contact_no,
        pan_number,
        reverse_charge_applicable,
        gst_composition_scheme,
        branch_gstnumber,
        branch_pin_code,
        gst_lut_bond,
        gst_filing_cycle,
        e_wayBill,
        sez_registration,
        eway_amount,
        type_gst_registration,
        branch_alt_email,
        branch_address,
        city_id,
        country_id,
        state_id,
        status,
        billing_status,
        alt_country_code,
        country_code,
        branch_contact_detail,
        branch_alt_contact_detail,
      } = req.body;

      const existingBranch = await branch.findOne({ where: { branch_name } });
      if (existingBranch && existingBranch.id != id) {
        return res.status(400).send({
          code: 400,
          message: "Branch with the same name already exists",
        });
      }
      const getAllData = await branch.findOne({ where: { id: id } });
      if (getAllData) {
        await branch.update(
          {
            branch_name,
            branch_contact_person_name,
            contact_no,
            pan_number,
            reverse_charge_applicable,
            gst_composition_scheme,
            branch_gstnumber,
            branch_pin_code,
            gst_lut_bond,
            gst_filing_cycle,
            e_wayBill,
            sez_registration,
            eway_amount,
            type_gst_registration,
            branch_contact_no,
            branch_email,
            branch_alt_email,
            alt_country_code,
            country_code,
            branch_address,
            city_id,
            country_id,
            state_id,
            status,
            billing_status,
            branch_contact_detail,
            branch_alt_contact_detail,
          },
          {
            where: { id: id },
          },
        );
        return res.status(200).send({
          code: 200,
          message: "Branch update Successfully!",
          // data: updateData
        });
      } else {
        return res.status(404).send({ code: 403, message: "id not found" });
      }
    } else {
      return res.status(404).send({ code: 403, message: "id not found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.delete_branch = async (req, res) => {
  try {
    const id = req.params.id;
    const getAllData = await branch.findOne({ where: { id: id } });
    if (getAllData) {
      await branch.update({ isDeleted: true }, { where: { id: id } });
      return res
        .status(200)
        .send({ code: 200, message: "Branch is Deleted Successfully!" });
    } else {
      return res.status(404).send({ code: 403, message: "id not found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.branchStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (status === undefined) {
      return res.status(400).send({
        code: 400,
        message:
          "Bad Request: 'status' property is missing in the request body",
      });
    }

    console.log(status);
    const getData = await branch.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    if (getData) {
      await branch.update(
        {
          status,
        },
        {
          where: {
            id: id,
          },
        },
      );
      return res.status(200).send({
        code: 200,
        message: "Branch Status Change Successfully!",
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);

    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
