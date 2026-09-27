const db = require('../../../../models/index');
const SalaryComponentVariableEarningModel = db.payroll_salaryComponentVariableEarning;
const {validateFields} = require('../../../../utils/inputValidator');


exports.createSalaryComponentVariableEarning = async (req, res) => {
  try {
    const requiredFields = ['variable_earning_name', 'name_in_payslip'];
    const validation = await validateFields(req.body, requiredFields);

    if (!validation.isValid) {
      return res.status(400).send({ status: false, message: validation.message });
    }

    // force checkbox values to be 0/1
    const payload = {
      variable_earning_name: req.body.variable_earning_name,
      name_in_payslip: req.body.name_in_payslip,
      calculation_amount: req.body.calculation_amount || 0,
      is_taxable: req.body.is_taxable ? 1 : 0,
      deduct_when_credited: req.body.deduct_when_credited ? 1 : 0,
      deduct_monthly: req.body.deduct_monthly ? 1 : 0,
      created_by: req.body.created_by || null,
      is_active: 1
    };

    const response = await SalaryComponentVariableEarningModel.create(payload);

    return res.status(200).send({
      status: true,
      message: "Created successfully",
      data: response
    });

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || 'Server Error'
    });
  }
};


// exports.getAllSlryCompEarningUnformatedData = async (req, res) => {
//     try {
//         // const { entityType, financialYear } = req.query;
//         const [list] = await db.sequelize.query(`
//         SELECT * FROM PAYROLL_SLRYCOMPONENT_EARNING pse WHERE pse.is_active = true`)

//         if (list.length <= 0) {
//             return res.status(400).send({status: false,message: "No list found", data: list});
//         }

//         return res.status(200).send({status: true,message: "Listed successfully",data: list});

//     } catch (error) {
//         return res.status(500).send({status: false,message: error.message || 'Server Error'});
//     }
// };

exports.getSlryCompVariableEarningById = async (req, res) => {
    try {
        // const { entityType, financialYear } = req.query;
        const id = req.params.id;
        const [list] = await db.sequelize.query(`
    SELECT * FROM PAYROLL_SLRYCOMPONENT_VARIABLE_EARNING pse WHERE id = ${id} ;`);

        if (list.length <= 0) {
            return res.status(400).send({status: false,message: "List Not Found", data: list});
        }

        return res.status(200).send({status: true,message: "Listed successfully",data: list[0]});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};

exports.updateSlryCompVariableEarning = async (req, res) => {
  try {
    const id = req.params.id;

    const existingData = await SalaryComponentVariableEarningModel.findOne({ where: { id } });
    if (!existingData) {
      return res.status(404).send({ status: false, message: "Record not found" });
    }

    const payload = {
      variable_earning_name: req.body.variable_earning_name ?? existingData.variable_earning_name,
      name_in_payslip: req.body.name_in_payslip ?? existingData.name_in_payslip,
      calculation_amount: req.body.calculation_amount ?? existingData.calculation_amount,
      is_taxable: req.body.is_taxable ? 1 : 0,
      deduct_when_credited: req.body.deduct_when_credited ? 1 : 0,
      deduct_monthly: req.body.deduct_monthly ? 1 : 0,
      updatedAt: new Date()
    };

    await SalaryComponentVariableEarningModel.update(payload, { where: { id } });

    const updatedRecord = await SalaryComponentVariableEarningModel.findOne({ where: { id } });

    return res.status(200).send({
      status: true,
      message: "Updated successfully",
      data: updatedRecord
    });

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || 'Server Error'
    });
  }
};


exports.updateSlryCompEarningStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const existingData = await SalaryComponentVariableEarningModel.findByPk(id);
        if (!existingData) {
            return res.status(404).send({ status: false, message: "Record not found" });
        }

        await SalaryComponentVariableEarningModel.update(
            { is_active: status }, 
            { where: { id: existingData.id } }
        );

        return res.status(200).send({ status: true, message: "Updated Successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};

exports.getAllActiveVariableEarning = async (req, res) => {
     try {
    const [list] = await db.sequelize.query(`
      SELECT 
        id,
        variable_earning_name,
        name_in_payslip,
        calculation_amount,
        is_taxable,
        deduct_monthly,
        deduct_when_credited,
        created_by,
        is_active,
        createdAt,
        updatedAt
      FROM PAYROLL_SLRYCOMPONENT_VARIABLE_EARNING
      WHERE is_active = true;
    `);

    if (!list || list.length === 0) {
      return res.status(201).send({
        status: false,
        message: "No list found",
        data: []
      });
    }

    return res.status(200).send({
      status: true,
      message: "Listed successfully",
      data: list
    });

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || 'Server Error'
    });
  }
};
exports.getAllCreatedSlryVariableEarning = async (req, res) => {
     try {
    const [list] = await db.sequelize.query(`
      SELECT 
        id,
        variable_earning_name,
        name_in_payslip,
        calculation_amount,
        is_taxable,
        created_by,
        is_active,
        createdAt,
        updatedAt
      FROM PAYROLL_SLRYCOMPONENT_VARIABLE_EARNING
    `);

    if (!list || list.length === 0) {
      return res.status(201).send({
        status: false,
        message: "No list found",
        data: []
      });
    }

    return res.status(200).send({
      status: true,
      message: "Listed successfully",
      data: list
    });

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || 'Server Error'
    });
  }
};