const db = require('../../../models/index');
const PayrollEsiModel = db.payroll_esi;
const {validateFields} = require('../../../utils/inputValidator');


exports.createEsi = async (req, res) => {
    try {
        const requiredFields = ['employee_contribution'];
        const validation = await validateFields(req.body, requiredFields);
        let   {entityType, financialYear} = req.query;
        let entity = parseInt(entityType)
        let financial_year = parseInt(financialYear)

        if (!validation.isValid) {
            return res.status(400).send({status: false,message: validation.message});
        }

        const allEpf = await PayrollEsiModel.findAll();
        const currentYear = new Date().getFullYear().toString();
        const epf_code = allEpf.length <= 0  ? `ESI/${currentYear}/001` : `ESI/${currentYear}/00${allEpf.length + 1}`;

        await PayrollEsiModel.update(
            { status: 'Inactive' }, 
            { where: {} }
        );

        const response = await PayrollEsiModel.create({...req.body,epf_code, entity, financial_year});
        return res.status(200).send({status: true,message: "ESI created successfully",data: response});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};


exports.getAllEsi = async (req, res) => {
    try {
        let { entityType, financialYear } = req.query;
        let entity = parseInt(entityType);
        let financial_year = parseInt(financialYear);

        // Base query
        let query = `
            SELECT pe.id, pe.esi_number, pe.deduction_cycle, pe.employee_contribution,
                pe.employer_contribution, pe.employee_contribution_in_ctc, 
                pe.created_by, pe.status
            FROM PAYROLL_ESI pe
            WHERE pe.status IN ('Active', 'Inactive')
        `;

        if (entity) {
            query += ` AND pe.entity = ${entity}`;
        }

        if (financial_year) {
            query += ` AND pe.financial_year = ${financial_year}`;
        }

        // Execute the query
        const [esiList] = await db.sequelize.query(query);

        if (esiList.length <= 0) {
            return res.status(400).send({ status: false, message: "No ESI list found", data: esiList });
        }

        return res.status(200).send({ status: true, message: "ESI Listed successfully", data: esiList });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};


exports.getEsiById = async (req, res) => {
    try {
        const id = req.params.id;
        const [esiList] = await db.sequelize.query(`
    SELECT pe.id,pe.esi_number,pe.deduction_cycle,pe.employee_contribution,
    pe.employer_contribution,pe.employee_contribution_in_ctc, pe.created_by
    FROM PAYROLL_ESI pe WHERE is_active = TRUE AND id = ${id};`);

        if (esiList.length <= 0) {
            return res.status(400).send({status: false,message: "No ESI list found", data: esiList});
        }

        return res.status(200).send({status: true,message: "ESI Listed successfully",data: esiList[0]});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};


exports.updateEsi = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            deduction_cycle,
            employee_contribution,
            employer_contribution,
            employee_contribution_in_ctc,
            created_by,
            esi_number
        } = req.body;

        const existingEsi = await PayrollEsiModel.findOne({ where: { id, is_active: true } });
        if (!existingEsi) {
            return res.status(404).send({ status: false, message: "ESI record not found" });
        }

        await PayrollEsiModel.update(
            { status: 'Inactive' }, 
            { where: {} }
        );

        await PayrollEsiModel.update(
            { is_active: false }, 
            { where: { id: existingEsi.id } }
        );

        const newEsi = await PayrollEsiModel.create({
            deduction_cycle,
            employee_contribution,
            employer_contribution,
            employee_contribution_in_ctc,
            created_by,
            esi_number
        });

        return res.status(200).send({ status: true, message: "ESI updated successfully", data: newEsi });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};


exports.updateEsiStatus = async (req, res) => {
    try {
        const id = req.params.id;
        let status = req.body.status;

        const existingEsi = await PayrollEsiModel.findOne({ where: { id} });
        if (!existingEsi) {
            return res.status(404).send({ status: false, message: "ESI record not found" });
        }
        
        await PayrollEsiModel.update(
            { status: 'Inactive' }, 
            { where: {} }
        );

        await PayrollEsiModel.update(
            { status: status }, 
            { where: { id: existingEsi.id } }
        );

        return res.status(200).send({ status: true, message: "ESI status updated successfully", data: existingEsi });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};
