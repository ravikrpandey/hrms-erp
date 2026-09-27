const db = require("../../../../app/models/index");

exports.create_perposal_type = async (req, res) => {
  try {
    const { perposal_type, perposal_discription, status } = req.body;
    const type = await db.perposal_type.findOne({
      where: { perposal_type: perposal_type, isDeleted: false },
    });
    if (type) {
      return res
        .status(403)
        .send({ code: 403, message: "perposal_type  Already Exists" });
    } else if (!type) {
      const response = await db.perposal_type.create({
        perposal_type,
        perposal_discription, status
      });
      return res
        .status(200)
        .send({
          code: 200,
          message: "perposal_type Created Successfully!",
          data: response,
        });
    }
  } catch (error) {
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getperposal_type = async (req, res) => {
  try {
    const data = await db.perposal_type.findAll({
      where: { isDeleted: false },
      order: [["id", "DESC"]],
    });

    if (data.length > 0) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Get All perposal_type Data Successfully",
          data: data,
        });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No perposal _type Data Found" });
    }
  } catch (error) {
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.perposal_typeById = async (req, res) => {
  try {
    const { id } = req.params;

    const whereCondition = {
      isDeleted: false,
    };

    if (id) {
      whereCondition.id = id;
    }
    const data = await db.perposal_type.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
    });

    if (id) {
      if (data.length > 0) {
        return res
          .status(200)
          .send({
            code: 200,
            message: "Get perposal_type Data Successfully..",
            data: data[0],
          });
      } else {
        return res
          .status(404)
          .send({ code: 404, message: "No Data found for the provided ID" });
      }
    } else {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Get All perposal_type Data Successfully",
          data: data,
        });
    }
  } catch (error) {
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.update_perposal_type = async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const { perposal_type, perposal_discription, status } = req.body;

      const existingBranch = await db.perposal_type.findOne({
        where: { perposal_type },
      });
      if (existingBranch && existingBranch.id != id) {
        return res
          .status(400)
          .send({
            code: 400,
            message: "perposal_type with the same name already exists",
          });
      }
      const getAllData = await db.perposal_type.findOne({ where: { id: id } });
      if (getAllData) {
        await db.perposal_type.update(
          {
            perposal_type,
            perposal_discription, status
          },
          {
            where: { id: id },
          }
        );
        return res.status(200).send({
          code: 200,
          message: "perposal_type update Successfully!",
        });
      } else {
        return res.status(404).send({ code: 403, message: "id not found" });
      }
    } else {
      return res.status(404).send({ code: 403, message: "id not found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.delete_perposal_type = async (req, res) => {
  try {
    const id = req.params.id;
    const getAllData = await db.perposal_type.findOne({ where: { id: id } });
    if (getAllData) {
      await db.perposal_type.update({ isDeleted: true }, { where: { id: id } });
      return res
        .status(200)
        .send({ code: 200, message: "perposal_type is Deleted Successfully!" });
    } else {
      return res.status(404).send({ code: 403, message: "id not found" });
    }
  } catch (error) {
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.perposal_typeStatus = async (req, res) => {
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
    const getData = await db.perposal_type.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    if (getData) {
      await db.perposal_type.update(
        {
          status,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send({
        code: 200,
        message: "perposal_type Status Change Successfully!",
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getperposal_typeActive = async (req, res) => {
  try {
    const data = await db.perposal_type.findAll({
      where: { isDeleted: false, status: "ACTIVE" },
      order: [["id", "DESC"]],
    });

    if (data.length > 0) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Get All perposal_type Data Successfully",
          data: data,
        });
    }
  } catch (error) {
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};
