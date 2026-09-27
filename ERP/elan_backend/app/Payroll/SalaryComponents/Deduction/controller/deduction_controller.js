const db = require('../../../../models/index');
const SalaryComponentDeductionModel = db.payroll_salaryComponentDeduction;
const {validateFields} = require('../../../../utils/inputValidator');


exports.createSalaryComponentDeduction  = async (req, res) => {
    try {
        const requiredFields = ['deduction_plan', 'calculation_type', 'name_in_payslip', 'deduction_frequency'];
        const validation = await validateFields(req.body, requiredFields);
        if (!validation.isValid) {
            return res.status(400).send({ status: false, message: validation.message });
        }
        const response = await SalaryComponentDeductionModel.create({
            ...req.body,
        });
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

exports.getAllSlryCompDeduction = async (req, res) => {
    try {
        // const { entityType, financialYear } = req.query;
            const [list] = await db.sequelize.query(`SELECT 
            psd.id,psd.deduction_plan,psd.name_in_payslip,psd.deduction_frequency,psd.is_active
            FROM PAYROLL_SLRYCOMPONENT_DEDUCTION psd
            ORDER BY psd.createdAt DESC;`)
        if (list.length <= 0) {
            return res.status(400).send({ status: false, message: "No list found", data: list });
        }
        return res.status(200).send({ status: true, message: "Listed successfully", data: list });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};

exports.getAllSlryCompDeductionUnformatedData = async (req, res) => {
    try {
        // const { entityType, financialYear } = req.query;

        const [list] = await db.sequelize.query(`
            SELECT *
            FROM PAYROLL_SLRYCOMPONENT_DEDUCTION psd 
            WHERE psd.is_active = 'Active'  
            ORDER BY psd.createdAt DESC;
        `, {
           
        });

        // const [epf] = await db.sequelize.query(`
        //     SELECT pe.*, 
        //            mecr.contribution_rate AS employee_contribution, 
        //            mecr2.contribution_rate AS employer_contribution,
        //            'EPF' AS deduction_plan 
        //     FROM PAYROLL_EPF pe 
        //     INNER JOIN MASTER_EMPLOYEE_CONTRIBUTION_RATE mecr ON pe.employee_contribution_rate = mecr.emp_contribution_rate_id 
        //     INNER JOIN MASTER_EMPLOYER_CONTRIBUTION_RATE mecr2 ON pe.employer_contribution_rate = mecr2.emplr_contribution_rate_id  
        //     WHERE pe.status = 'Active' 
        //     LIMIT 1;
        // `);

        // const [esi] = await db.sequelize.query(`
        //     SELECT pe.*, 
        //            'ESI' AS deduction_plan 
        //     FROM PAYROLL_ESI pe 
        //     WHERE pe.status = 'Active' 
        //     LIMIT 1;
        // `);

        if (list.length === 0) {
            return res.status(400).send({ status: false, message: "No list found", data: list });
        }

        // if (epf && epf.length > 0) {
        //     list.push(epf[0]);
        // }

        // if (esi && esi.length > 0) {
        //     list.push(esi[0]);
        // }

        return res.status(200).send({ status: true, message: "Listed successfully", data: list });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};


exports.getSlryCompDeductionById = async (req, res) => {
    try {
        // const { entityType, financialYear } = req.query;
        const id = req.params.id;
        const [list] = await db.sequelize.query(`
          SELECT * FROM PAYROLL_SLRYCOMPONENT_DEDUCTION psr 
          WHERE id = ${id} `);
        if (list.length <= 0) {
            return res.status(400).send({status: false,message: "No List Found", data: list});
        }
        return res.status(200).send({status: true,message: "Listed Successfully",data: list[0]});
    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};

exports.updateSlryCompDeduction= async (req, res) => {
    try {
        const id = req.params.id;
        // const { entityType, financialYear } = req.query;
        const existingRecord = await SalaryComponentDeductionModel.findByPk(id);
        if (!existingRecord) {
            return res.status(404).send({ status: false, message: "Record Not Found" });
        }
        let response = await SalaryComponentDeductionModel.update(
            { ...req.body },
            { where: { id: existingRecord.id} }
        );
        return res.status(200).send({ status: true, message: "Updated Successfully", data: response });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};

exports.updateSlryCompDeductionStatus= async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        const existingRecord = await SalaryComponentDeductionModel.findByPk(id);
        if (!existingRecord) {
            return res.status(404).send({ status: false, message: "Record Not Found" });
        }
        await SalaryComponentDeductionModel.update(
            { is_active: status }, {where: { id: existingRecord.id }} 
        );
        return res.status(200).send({ status: true, message: "Updated Successfully", data: existingRecord });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};