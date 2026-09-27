const db = require("../../../models/index");

exports.createArea = async (req, res) => {
  try {
    const { area_name, department_name } = req.body;

    const existDept = await db.department.findAll({
      where: { department_name: department_name, isDeleted: false },
    });

    if (existDept.length == 0) {
      return res.status(404).send({
        code: 404,
        message: "Department not found",
      });
    }

    const createdAreas = [];

    for (i = 0; i < existDept.length; i++) {
      const existArea = await db.area.findOne({
        where: {
          area_name: area_name,
          department_id: existDept[i].dept_id,
          entity_id: existDept[i].entity_id,
          isDeleted: false,
        },
      });

      if (existArea) {
        continue;
      }

      const newArea = await db.area.create({
        department_id: existDept[i].dept_id,
        entity_id: existDept[i].entity_id,
        area_name: area_name,
      });

      createdAreas.push(newArea);
    }

    if (createdAreas.length === 0) {
      return res.status(409).send({
        code: 409,
        message:
          "All sub-departments already exist for the given department and entities",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Sub-departments created successfully",
      data: createdAreas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};
exports.getAllArea = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const query = `
            SELECT A.id, D.department_name, D.department_code, A.area_name, A.status
            FROM MASTER_AREA A
            INNER JOIN MASTER_DEPARTMENT D ON A.department_id = D.dept_id
            WHERE A.isDeleted = false AND A.entity_id = ?
        `;
    const getAllData = await db.sequelize.query(query, {
      replacements: [entity_id],
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (getAllData.length === 0) {
      return res
        .status(404)
        .send({ code: 404, message: "No Sub-Department found" });
    }
    return res.status(200).send({
      code: 200,
      message: "Get All Sub-Department Successfully",
      data: getAllData,
    });
  } catch (error) {
    console.error("Error fetching Sub-Department data:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};
exports.getByIdArea = async (req, res) => {
  try {
    const areaId = req.params.id;

    const query = `
        SELECT A.id,A.department_id, D.department_name, D.department_code,A.area_name,A.status
        FROM MASTER_AREA A
        INNER JOIN MASTER_DEPARTMENT D ON A.department_id = D.dept_id
        WHERE A.isDeleted = false AND A.id =  ${areaId}`;

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch Sub-Department Data Successfully",
        data: getAllData[0],
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.updateAreaById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(403).send({ code: 403, message: "ID not found" });
    }
    const { old_area_name, new_area_name, department_name } = req.body;

    const existDept = await db.department.findAll({
      where: { department_name: department_name, isDeleted: false },
    });

    if (existDept.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "Department not found",
      });
    }

    for (let i = 0; i < existDept.length; i++) {
      const existArea = await db.area.findOne({
        where: {
          area_name: old_area_name,
          department_id: existDept[i].dept_id,
          entity_id: existDept[i].entity_id,
          isDeleted: false,
        },
      });

      if (existArea) {
        await db.area.update(
          { area_name: new_area_name },
          {
            where: {
              area_name: old_area_name,
              department_id: existDept[i].dept_id,
              entity_id: existDept[i].entity_id,
            },
          }
        );
      } else {
        await db.area.create({
          department_id: existDept[i].dept_id,
          entity_id: existDept[i].entity_id,
          area_name: new_area_name,
        });
      }
    }
    return res.status(200).send({
      code: 200,
      message: "Area updated successfully",
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.deleteArea = async (req, res) => {
  try {
    const area_id = req.params.id;
    const dltStage = await db.area.findOne({ where: { id: area_id } });
    if (dltStage) {
      const deleteData = await db.area.update(
        { isDeleted: true },
        { where: { id: area_id } }
      );
      return res.status(200).send({
        code: 200,
        message: "Data Deleted Successfully!",
        data: deleteData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.AreaStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const getData = await db.area.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    if (getData) {
      const updated = await db.area.update({ status }, { where: { id: id } });
      return res.status(200).send({
        code: 200,
        message: "Area Status Change Successfully!",
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
