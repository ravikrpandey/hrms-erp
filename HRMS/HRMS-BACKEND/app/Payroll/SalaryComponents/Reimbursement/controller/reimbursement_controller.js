const db = require('../../../../models/index');
const SalaryComponentReimbursementModel = db.payroll_salaryComponentReimbursement;
const {validateFields} = require('../../../../utils/inputValidator');


// exports.createSalaryComponentReimbursement  = async (req, res) => {
//     try {
//         const requiredFields = ['reimbursement_name', 'max_limit' ];
//         const validation = await validateFields(req.body, requiredFields);

//         if (!validation.isValid) {
//             return res.status(400).send({ status: false, message: validation.message });
//         }

//         const response = await SalaryComponentReimbursementModel.create({
//             ...req.body,
//         });

//         return res.status(200).send({
//             status: true,
//             message: "Created successfully",
//             data: response
//         });

//     } catch (error) {
//         return res.status(500).send({
//             status: false,
//             message: error.message || 'Server Error'
//         });
//     }
// };


exports.createSalaryComponentReimbursement  = async (req, res) => {
        try {
            const requiredFields = ['reimbursement_name' ];
            const validation = await validateFields(req.body, requiredFields);
    
            if (!validation.isValid) {
                return res.status(400).send({ status: false, message: validation.message });
            }
    
            const response = await SalaryComponentReimbursementModel.create({
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



exports.getAllSlryCompReimbursement = async (req, res) => {
    try {
        // const { entityType, financialYear } = req.query;
        const [list] = await db.sequelize.query(`
           SELECT psr.*
                 FROM PAYROLL_SLRYCOMPONENT_REIMBURSEMENT psr 
         ORDER BY psr.createdAt DESC;`)

        if (list.length <= 0) {
            return res.status(400).send({ status: false, message: "No list found", data: list });
        }

        return res.status(200).send({ status: true, message: "Listed successfully", data: list });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};



exports.getAllSlryCompReimbursementUnformatedData = async (req, res) => {
    try {
        const { entityType, financialYear } = req.query;
        const [list] = await db.sequelize.query(`
         SELECT *
         FROM PAYROLL_SLRYCOMPONENT_REIMBURSEMENT psr 
         WHERE is_active = 'Active' ORDER BY psr.createdAt DESC;`)

        if (list.length <= 0) {
            return res.status(200).send({ status: true, message: "No list found", data: list });
        }

        return res.status(200).send({ status: true, message: "Listed successfully", data: list });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};

exports.getSlryCompReimbursementById = async (req, res) => {
    try {
        const id = req.params.id;
        const [list] = await db.sequelize.query(`
     SELECT * FROM PAYROLL_SLRYCOMPONENT_REIMBURSEMENT psr WHERE
    id = ${id} ;`);

        if (list.length <= 0) {
            return res.status(400).send({status: false,message: "No List Found", data: list});
        }

        return res.status(200).send({status: true,message: "Listed Successfully",data: list[0]});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};


exports.updateSlryCompReimbursement= async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        const existingRecord = await SalaryComponentReimbursementModel.findByPk(id);
        if (!existingRecord) {
            return res.status(404).send({ status: false, message: "Record Not Found" });
        }

        await SalaryComponentReimbursementModel.update(
            { ...req.body, is_active: status },
            { where: { id: existingRecord.id } }
        );
        
        return res.status(200).send({ status: true, message: "Updated Successfully", data: existingRecord });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};

exports.updateSlryCompReimbursementStatus= async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        const existingRecord = await SalaryComponentReimbursementModel.findByPk(id);
        if (!existingRecord) {
            return res.status(404).send({ status: false, message: "Record Not Found" });
        }

        await SalaryComponentReimbursementModel.update(
            { is_active:status }, {where: { id: existingRecord.id }} 
        );

        return res.status(200).send({ status: true, message: "Updated Successfully", data: existingRecord });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};



exports.create_other_allowances  = async (req, res) => {
    try {
        const requiredFields = ['allowance_name' ];
        const validation = await validateFields(req.body, requiredFields);

        if (!validation.isValid) {
            return res.status(400).send({ status: false, message: validation.message });
        }

        const response = await db.payroll_other_allowances.create({
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




exports.getAll_otherAllowance = async (req, res) => {
    try {
        // const { entityType, financialYear } = req.query;
        const [list] = await db.sequelize.query(`
           SELECT poa.*
                 FROM PAYROLL_OTHER_ALLOWANCES poa 
         ORDER BY poa.createdAt ASC;`)

        if (list.length <= 0) {
            return res.status(400).send({ status: false, message: "No list found", data: list });
        }

        return res.status(200).send({ status: true, message: "Listed successfully", data: list });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};




exports.getAll_percentageList = async (req, res) => {
    try {
        let [list] = await db.sequelize.query(`SELECT * FROM MASTER_EARNING_TYPE met WHERE is_deleted = FALSE;`);
        if (list.length <= 0) {
            return res.status(400).send({
                code: 400,
                message: "Record Not found"
            });
        }

        // list.push({"earning_name":'Gross Salary', 'earning_type_code': 'gross_salary'}, {"earning_name":'Self', "earning_type_code":'NA'})
        return res.status(200).send({
            code: 200,
            message: "Fetched Successfully!",
            data: list
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};