const db = require("../../../../models/index");
const roleDetails = db.role;

/////////////// Create Role ///////////////

exports.createRole = async (req, res) => {
  try {
    const { role_name, status } = req.body;
    const roleData = await roleDetails.findOne({
      where: { role_name: role_name },
    });
    if (roleData) {
      return res
        .status(403)
        .send({ code: 403, message: "Role is Already Exists!" });
    } else {
      const response = await roleDetails.create({
        role_name,
        status,
      });
      return res
        .status(200)
        .send({
          code: 200,
          message: "Role Created Successfully!",
          data: response,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Edit Role ///////////////

exports.editRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const roleData = await roleDetails.findOne({ where: { id: roleId } });
    if (roleData) {
      const updateData = await roleDetails.update(req.body, {
        where: { id: roleId },
      });
      return res
        .status(200)
        .send({
          code: 200,
          message: "Role Updated Successfully",
          data: updateData,
        });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Get All Role ///////////////

exports.getAllRole = async (req, res) => {
  try {
    const getAllData = await roleDetails.findAll({
      where: { status: "ACTIVE" },
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetch All Role Data Successfully",
          data: getAllData,
        });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// GetById Role ///////////////

exports.getByIdRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const getData = await roleDetails.findOne({ where: { id: roleId } });
    if (getData) {
      return res
        .status(200)
        .send({ code: 200, message: "Fetch data Successfully", data: getData });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Delete Role ///////////////

exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const dltRole = await roleDetails.findOne({ where: { id: roleId } });
    if (dltRole) {
      const deleteData = await roleDetails.update(
        { status: "INACTIVE" },
        { where: { id: roleId } }
      );
      return res
        .status(200)
        .send({
          code: 200,
          message: "Role Data is Deleted Successfully!",
          data: deleteData,
        });
    } else {
      return res.status(403).send({ code: 403, message: "Recorb Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};
