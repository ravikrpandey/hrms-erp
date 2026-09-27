const e = require("express");
const db = require("../../../models/index");
const emp_document_model = db.emp_sign_data;
const User_model = db.user;
// const baseUrl = "http://localhost:5000/"
const baseUrl = "https://emerp.elitetraveltech.in/";
exports.create_emp_sign = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const emp_signature = req?.file?.path ?? " ";

    const verify_employee = await User_model.findOne({
      where: { employee_id },
    });

    if (!verify_employee) {
      return res.status(404).send({ message: "No Such employee for this Id" });
    }

    const find_previous_signature = await emp_document_model.findOne({
      where: { employee_id },
    });

    if (find_previous_signature) {
      return res
        .status(403)
        .send({ message: "Employee Signature already exists" });
    }

    const create_emp_sign = await emp_document_model.create({
      employee_id,
      emp_signature: baseUrl + emp_signature,
    });
    return res
      .status(200)
      .send({ message: "signed Registered", data: create_emp_sign });
  } catch (error) {
    // logger...
    // logger.info
    // logger.error
    // logger.debug
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.get_emp_document_by_id = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const verify_emp = await emp_document_model.findOne({
      where: { employee_id },
    });
    if (verify_emp)
      return res.send({ message: "signature found", data: verify_emp });
    return res
      .status(404)
      .send({ message: "No such employee with employee_id" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.get_all_employee_sign = async (req, res) => {
  try {
    const employee_data = await emp_document_model.findAll({
      where: { status: "ACTIVE" },
    });
    return res.send({ message: "signatures found", data: employee_data });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.update_emp_sign = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const emp_signature = req.file.path == undefined ? " " : req.file.path;
    const get_document = await emp_document_model.findOne({
      where: { employee_id: employee_id },
    });
    if (get_document) {
      const update_emp_sign = await emp_document_model.update(
        {
          emp_signature: baseUrl + emp_signature,
        },
        { where: { employee_id: employee_id } }
      );
      return res.send({ message: "employe_sign updated" });
    } else {
      return res.status(404).send({ message: "No such document" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.Inactive_employee_sign = async (req, res) => {
  try {
    const employee_id = req.params.id;
    await emp_document_model.update(
      {
        status: "INACTIVE",
      },
      { where: { employee_id: employee_id } }
    );
    return res.status(200).send({ message: "Employee signature Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.delete_employe_sign = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const delete_emp = await emp_document_model.destroy({
      where: { employee_id: employee_id },
    });
    return res.send({ message: "Employee signature deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
