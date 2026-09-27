const db = require("../../../models/index");
const PayrollEsiModel = db.payroll_esi;
const { validateFields } = require("../../../utils/inputValidator");

exports.createEsi = async (req, res) => {
  try {
    const requiredFields = ["employee_contribution"];
    const validation = await validateFields(req.body, requiredFields);
    let { financialYear, entityType } = req.query;  // ✅ also accept entityType from query
    let financial_year = parseInt(financialYear);

    if (!validation.isValid) {
      return res
        .status(400)
        .send({ status: false, message: validation.message });
    }

    // Check if already exists for this financial year
    const existingEsi = await PayrollEsiModel.findOne({
      where: {  is_active: true }
    });

    if (existingEsi) {
      return res.status(400).send({
        status: false,
        message: "ESI record already exists. Please update instead."
      });
    }

    // Generate ESI code
    const allEsi = await PayrollEsiModel.findAll();
    const currentYear = new Date().getFullYear().toString();
    const esi_code =
      allEsi.length <= 0
        ? `ESI/${currentYear}/001`
        : `ESI/${currentYear}/00${allEsi.length + 1}`;

    // ✅ explicitly set entity
    const response = await PayrollEsiModel.create({
      ...req.body,
      esi_code,
      entity: req.body.entity || entityType || null,  // <- FIXED
      is_active: true,
      status: "Active"
    });

    return res.status(200).send({
      status: true,
      message: "ESI created successfully",
      data: response,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: error.message || "Internal server error" });
  }
};



exports.getAllEsi = async (req, res) => {
  try {
    let { entityType, financialYear } = req.query;
    // let entity = parseInt(entityType);
    // let financial_year = parseInt(financialYear);

    // Base query
    let query = `
            SELECT pe.id, pe.deduction_cycle, pe.employee_contribution,
                pe.employer_contribution, pe.employer_contribution_in_ctc, 
                pe.created_by, pe.status
            FROM PAYROLL_ESI pe
            WHERE pe.status IN ('Active', 'Inactive')
        `;

    // if (entity) {
    //   query += ` AND pe.entity = ${entity}`;
    // }

    // if (financial_year) {
    //   query += ` AND pe.financial_year = ${financial_year}`;
    // }

    // Execute the query
    const [esiList] = await db.sequelize.query(query);

    if (esiList.length <= 0) {
      return res
        .status(200)
        .send({ status: true, message: "No data found!", data: esiList });
    }

    return res.status(200).send({
      status: true,
      message: "Data found successfully!",
      data: esiList,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.getEsiById = async (req, res) => {
  try {
    const id = req.params.id;
    const [esiList] = await db.sequelize.query(`
    SELECT pe.id,pe.deduction_cycle,pe.employee_contribution,
    pe.employer_contribution,pe.employer_contribution_in_ctc, pe.created_by
    FROM PAYROLL_ESI pe WHERE is_active = TRUE AND id = ${id};`);

    if (esiList.length <= 0) {
      return res
        .status(400)
        .send({ status: false, message: "No data found!", data: esiList });
    }

    return res.status(200).send({
      status: true,
      message: "ESI listed successfully!",
      data: esiList[0],
    });
  } catch (error) {
    return res
      .status(500)
      .send({
        status: false,
        message: error.message || "Internal server error",
      });
  }
};

exports.updateEsi = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      deduction_cycle,
      employee_contribution,
      employer_contribution,
      employer_contribution_in_ctc,
      created_by,
    } = req.body;

    let { financialYear } = req.query;
    let financial_year = parseInt(financialYear);

    if (!financial_year) {
      return res.status(400).send({
        status: false,
        message: "Financial year is required!"
      });
    }

    //  Check if record exists
    const existingEsi = await PayrollEsiModel.findOne({
      where: { id }
    });

    if (!existingEsi) {
      return res.status(404).send({ status: false, message: "No ESI record found!" });
    }

    //  Update existing record only
    await PayrollEsiModel.update(
      {
        deduction_cycle,
        employee_contribution,
        employer_contribution,
        employer_contribution_in_ctc,
        created_by,
        financial_year,
        status: "Active",
        updatedAt: new Date(),
      },
      { where: { id: existingEsi.id } }
    );

    const updatedEsi = await PayrollEsiModel.findOne({ where: { id: existingEsi.id } });

    return res.status(200).send({
      status: true,
      message: "ESI updated successfully!",
      data: updatedEsi,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: error.message || "Internal server error" });
  }
};


exports.updateEsiStatus = async (req, res) => {
  try {
    const id = req.params.id;
    let { status } = req.body;

    //  Fetch existing record
    const existingEsi = await PayrollEsiModel.findOne({ where: { id } });
    if (!existingEsi) {
      return res.status(404).send({ status: false, message: "No ESI record found!" });
    }

    //  Only update this record (no mass deactivation)
    await PayrollEsiModel.update(
      { status },
      { where: { id: existingEsi.id } }
    );

    const updatedEsi = await PayrollEsiModel.findOne({ where: { id: existingEsi.id } });

    return res.status(200).send({
      status: true,
      message: "ESI status updated successfully!",
      data: updatedEsi,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: error.message || "Internal server error" });
  }
};
