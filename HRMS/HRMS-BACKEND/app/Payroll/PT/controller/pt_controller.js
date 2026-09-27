const db = require("../../../models/index");
const Op = db.Sequelize.Op;

// exports.getEntityStateDataById = async (req, res) => {
//   try {
//     const entity_id = req.query.entityType;
//     const [data] = await db.sequelize.query(`
//     SELECT EM.id AS entity_id,EM.country_id,EM.state_id,MC.countryss_name,MS.states_name
//     FROM ENTITY_MASTER AS EM
//     LEFT JOIN MASTER_STATE AS MS ON EM.state_id=MS.states_id
//     LEFT JOIN MASTER_COUNTRY AS MC ON EM.country_id=MC.countryss_id
//     WHERE id = ${entity_id}`);

//     if (data.length <= 0) {
//       return res.status(400).send({
//         code: 400,
//         status: false,
//         message: "Data not found!",
//         data: data,
//       });
//     }

//     return res.status(200).send({
//       code: 200,
//       status: true,
//       message: "Data fetched successfully!",
//       data: data[0],
//     });
//   } catch (error) {
//     return res.status(500).send({
//       code: 500,
//       status: false,
//       message: error.message || "Internal server error!",
//     });
//   }
// };

exports.createPt = async (req, res) => {
  try {
    const { stateName, slabs } = req.body;

    if (!stateName || !Array.isArray(slabs) || slabs.length === 0) {
      return res.status(400).send({
        status: false,
        message: "State name and slabs are required!",
      });
    }

    const normalizedInput = stateName.replace(/\s+/g, "").toLowerCase();

    // fetch all active records
    const existing = await db.payroll_pt.findAll({
      where: { is_deleted: false },
    });

    const duplicate = existing.find((pt) => {
      const normalizedDb = pt.state_name.replace(/\s+/g, "").toLowerCase();
      return normalizedDb === normalizedInput;
    });

    if (duplicate) {
      return res.status(400).send({
        status: false,
        message: `Professional tax already exists for ${stateName}!`,
      });
    }

    const pt = await db.payroll_pt.create({
      state_name: stateName,
      pt_slabs: slabs,
    });

    return res.status(200).send({
      status: true,
      message: "Professional tax created successfully!",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};


exports.getAllPt = async (req, res) => {
  try {
    let query = `
            SELECT id,state_name,status FROM PAYROLL_PT                
            WHERE is_deleted = false`;
    const [ptList] = await db.sequelize.query(query);

    if (ptList.length <= 0) {
      return res.status(200).send({
        status: true,
        code: 404,
        message: "Data not found!",
        data: ptList,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Data fetched successfully!",
      data: ptList,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};

exports.updatePtStatusById = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const existingPt = await db.payroll_pt.findOne({ where: { id } });
    if (!existingPt) {
      return res
        .status(404)
        .send({ status: false, message: "Record not found!" });
    }

    await existingPt.update({ status });

    return res.status(200).send({
      status: true,
      message: `Status updated successfully!`,
      data: existingPt,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};

exports.getPtById = async (req, res) => {
  try {
    const id = req.params.id;
    const [data] = await db.sequelize.query(`
    SELECT state_name,pt_slabs,is_deleted,status 
    FROM PAYROLL_PT pe WHERE id = ${id}`);

    if (data.length <= 0) {
      return res.status(400).send({ status: false, message: "No data found!" });
    }

    return res.status(200).send({
      status: true,
      message: "Data fetched successfully!",
      data: data[0],
    });
  } catch (error) {
    return res
      .status(500)
      .send({
        status: false,
        message: error.message || "Internal server error!",
      });
  }
};

exports.updatePtById = async (req, res) => {
  try {
    const id = req.params.id;
    const { stateName, slabs } = req.body;

      const existingPt = await db.payroll_pt.findOne({
      where: { id, is_deleted: false },
    });
    if (!existingPt) {
      return res
        .status(404)
        .send({ status: false, message: "Record not found!" });
    }

    // Normalize for duplicate check
    const normalizedInput = stateName.replace(/\s+/g, "").toLowerCase();

    // Check duplicates excluding the same record
    const duplicate = await db.payroll_pt.findOne({
      where: {
        is_deleted: false,
        id: { [db.Sequelize.Op.ne]: id },
      },
    });

    if (duplicate) {
      const normalizedDb = duplicate.state_name
        .replace(/\s+/g, "")
        .toLowerCase();

      if (normalizedDb === normalizedInput) {
        return res.status(400).send({
          status: false,
          message: `Professional tax already exists for this state!`,
        });
      }
    }

    // Update record
    await db.payroll_pt.update(
      {
        state_name: stateName,
        pt_slabs: slabs,
        status: "ACTIVE",
        updatedAt: new Date(),
      },
      { where: { id } }
    );
    return res.status(200).send({
      status: true,
      message: "Professional tax updated successfully!",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};

