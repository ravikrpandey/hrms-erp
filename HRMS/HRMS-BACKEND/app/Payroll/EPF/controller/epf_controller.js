const db = require("../../../models/index");
const Op = db.Sequelize.Op;
const EPFModel = db.payroll_epf;
const { validateFields } = require("../../../utils/inputValidator");

// exports.createEpf = async (req, res) => {
//   try {
//     let { financialYear } = req.query;
//     // let entity = parseInt(entityType);
//     let financial_year = parseInt(financialYear);
//     const requiredFields = ["employee_contribution_rate"];
//     const validation = await validateFields(req.body, requiredFields);

//     if (!validation.isValid) {
//       return res
//         .status(400)
//         .send({ status: false, message: validation.message });
//     }

//     const allEpf = await EPFModel.findAll();
//     const currentYear = new Date().getFullYear().toString();
//     const epf_code =
//       allEpf.length <= 0
//         ? `EPF/${currentYear}/001`
//         : `EPF/${currentYear}/00${allEpf.length + 1}`;

//     await EPFModel.update({ status: "Inactive" }, { where: {} });

//     const response = await EPFModel.create({
//       ...req.body,
//       epf_code,
//       // entity,
//       financial_year,
//     });
//     return res.status(200).send({
//       status: true,
//       message: "EPF created successfully",
//       data: response,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ status: false, message: error.message || "Server Error" });
//   }
// };

exports.createEpf = async (req, res) => {
  try {
    let { financialYear } = req.query;
    let financial_year = parseInt(financialYear);

    const requiredFields = ["employee_contribution_rate"];
    const validation = await validateFields(req.body, requiredFields);
    if (!validation.isValid) {
      return res
        .status(400)
        .send({ status: false, message: validation.message });
    }

    // ✅ Check if EPF already exists for the given financial year
    const existingEpf = await EPFModel.findOne({
      where: {  is_deleted: false },
    });

    if (existingEpf) {
      return res.status(400).send({
        status: false,
        message: "EPF record already exists. Please update instead.",
      });
    }

    // Generate EPF code
    const allEpf = await EPFModel.findAll();
    const currentYear = new Date().getFullYear().toString();
    const epf_code =
      allEpf.length <= 0
        ? `EPF/${currentYear}/001`
        : `EPF/${currentYear}/00${allEpf.length + 1}`;

    const response = await EPFModel.create({
      ...req.body,
      epf_code,
      status: "Active",
    });

    return res.status(200).send({
      status: true,
      message: "EPF created successfully",
      data: response,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: error.message || "Server Error" });
  }
};

exports.getAllEpf = async (req, res) => {
  try {
    let { financialYear } = req.query;
    let financial_year = parseInt(financialYear);

    // Base query
    let query = `
            SELECT 
                pe.id,
                pe.epf_number,
                pe.epf_code,
                CASE 
                    WHEN mecr.contribution_rate = 'N/A' THEN 'N/A'
                    ELSE CONCAT(mecr.contribution_rate, "% of Actual PF Wage")
                END AS employee_contribution_rate,
                CASE 
                    WHEN mecr2.contribution_rate = 'N/A' THEN 'N/A'
                    ELSE CONCAT(mecr2.contribution_rate, "% of Actual PF Wage")
                END AS employer_contribution_rate,
                pe.is_employer_contribution_in_ctc, 
                pe.is_edli_contribution_in_ctc, 
                pe.is_admin_charges_in_ctc,
                pe.is_pro_rate_restricted_pf_wage, 
                pe.consider_salary_components_if_low_pf,
                pe.edli_rate,
                pe.admin_charges_rate,
                pe.admin_charges_cap,
                pe.status
            FROM 
                PAYROLL_EPF pe
            INNER JOIN 
                MASTER_EMPLOYEE_CONTRIBUTION_RATE mecr ON mecr.emp_contribution_rate_id = pe.employee_contribution_rate 
            INNER JOIN 
                MASTER_EMPLOYER_CONTRIBUTION_RATE mecr2 ON mecr2.emplr_contribution_rate_id = pe.employer_contribution_rate 
            WHERE 
               pe.is_deleted = false AND pe.status IN ('Active', 'Inactive')
        `;

    // Add condition for entityType if provided
    // if (!isNaN(entity)) {
    //   query += ` AND pe.entity = ${entity}`;
    // }

    // Add condition for financialYear if provided
    // if (!isNaN(financial_year)) {
    //   query += ` AND pe.financial_year = ${financial_year} `;
    // }

    // Execute the query
    const [epfList] = await db.sequelize.query(query);

    if (epfList.length <= 0) {
      return res
        .status(200)
        .send({ status: true, message: "Data not found!", data: epfList });
    }

    return res.status(200).send({
      status: true,
      message: "Data fetched successfully!",
      data: epfList,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};

exports.getEpfById = async (req, res) => {
  try {
    const id = req.params.id;
    const [epfList] = await db.sequelize.query(`
    SELECT pe.id,pe.epf_number,pe.epf_code,employee_contribution_rate,
    pe.is_employer_contribution_in_ctc,
    pe.is_edli_contribution_in_ctc, pe.employer_contribution_rate,
    pe.is_admin_charges_in_ctc,
    pe.edli_rate,
    pe.admin_charges_rate,
    pe.admin_charges_cap,
    pe.consider_salary_components_if_low_pf 
    FROM PAYROLL_EPF pe WHERE id = ${id} ORDER BY pe.createdAt desc;`);

    if (epfList.length <= 0) {
      return res
        .status(400)
        .send({ status: false, message: "No Epf list found", data: epfList });
    }

    return res.status(200).send({
      status: true,
      message: "EPF Listed successfully",
      data: epfList[0],
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: error.message || "Server Error" });
  }
};

// exports.updateEpf = async (req, res) => {
//   try {
//     const id = req.params.id;
//     let { financialYear } = req.query;
//     // let entity = parseInt(entityType);
//     let financial_year = parseInt(financialYear);
//     const {
//       consider_salary_components_if_low_pf,
//       created_by,
//       employee_contribution_rate,
//       employer_contribution_rate,
//       epf_number,
//       is_admin_charges_in_ctc,
//       is_edli_contribution_in_ctc,
//       is_employer_contribution_in_ctc,
//       // is_pro_rate_restricted_pf_wage,
//       // override_at_employee_level,
//     } = req.body;

//     const existingEpf = await EPFModel.findOne({
//       where: { id, is_deleted: false },
//     });
//     if (!existingEpf) {
//       return res
//         .status(404)
//         .send({ status: false, message: "EPF record not found" });
//     }

//     await EPFModel.update({ status: "Inactive" }, { where: {} });

//     await EPFModel.update(
//       { is_deleted: true },
//       { where: { id: existingEpf.id } }
//     );

//     const newEpf = await EPFModel.create({
//       consider_salary_components_if_low_pf,
//       created_by,
//       employee_contribution_rate,
//       employer_contribution_rate,
//       epf_number,
//       // entity,
//       financial_year,
//       is_admin_charges_in_ctc,
//       is_edli_contribution_in_ctc,
//       is_employer_contribution_in_ctc,
//       // is_pro_rate_restricted_pf_wage,
//       // override_at_employee_level,
//       updatedAt: new Date(),
//     });

//     return res.status(200).send({
//       status: true,
//       message: "EPF updated successfully",
//       data: newEpf,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ status: false, message: error.message || "Server Error" });
//   }
// };

exports.updateEpf = async (req, res) => {
  try {
    let { financialYear } = req.query;
    let financial_year = parseInt(financialYear);

    const {
      consider_salary_components_if_low_pf,
      created_by,
      employee_contribution_rate,
      employer_contribution_rate,
      epf_number,
      is_admin_charges_in_ctc,
      is_edli_contribution_in_ctc,
      is_employer_contribution_in_ctc,
      edli_rate,
      admin_charges_rate,
      admin_charges_cap,
    } = req.body;

    //  Check if EPF exists for that financial year
    const existingEpf = await EPFModel.findOne({
      where: {  is_deleted: false },
    });

    if (!existingEpf) {
      return res.status(404).send({
        status: false,
        message:
          "No EPF record found for this financial year. Please create first.",
      });
    }

    //  Simply update the existing one (no new record creation)
    await EPFModel.update(
      {
        consider_salary_components_if_low_pf,
        created_by,
        employee_contribution_rate,
        employer_contribution_rate,
        epf_number,
        status: "Active",
        is_admin_charges_in_ctc,
        is_edli_contribution_in_ctc,
        is_employer_contribution_in_ctc,
        edli_rate,
        admin_charges_rate,
        admin_charges_cap,
        updatedAt: new Date(),
      },
      { where: { id: existingEpf.id } }
    );

    const updatedEpf = await EPFModel.findOne({
      where: { id: existingEpf.id },
    });

    return res.status(200).send({
      status: true,
      message: "EPF updated successfully",
      data: updatedEpf,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: error.message || "Server Error" });
  }
};

exports.updateEpfStatus = async (req, res) => {
  try {
    const id = req.params.id;
    let { status } = req.body;

    // Fetch existing record
    const existingEpf = await EPFModel.findOne({
      where: { id, is_deleted: false },
    });
    if (!existingEpf) {
      return res
        .status(404)
        .send({ status: false, message: "EPF record not found" });
    }

    // Only update this record (don’t touch others)
    await EPFModel.update({ status }, { where: { id: existingEpf.id } });

    const updatedEpf = await EPFModel.findOne({
      where: { id: existingEpf.id },
    });

    return res.status(200).send({
      status: true,
      message: "EPF status updated successfully",
      data: updatedEpf,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: error.message || "Server Error" });
  }
};
