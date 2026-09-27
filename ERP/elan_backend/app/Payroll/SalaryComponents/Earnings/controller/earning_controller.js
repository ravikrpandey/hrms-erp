const db = require('../../../../models/index');
const SalaryComponentEarningModel = db.payroll_salaryComponentEarning;
const {validateFields} = require('../../../../utils/inputValidator');


exports.createSalaryComponentEarning  = async (req, res) => {
    try {
        const requiredFields = ['earning_name'];
        const validation = await validateFields(req.body, requiredFields);

        if (!validation.isValid) {
            return res.status(400).send({ status: false, message: validation.message });
        }

        const response = await SalaryComponentEarningModel.create({
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


exports.getAllSlryCompEarning = async (req, res) => {
    try {
        // const { entityType, financialYear } = req.query;
        const [list] = await db.sequelize.query(`
SELECT 
    pse.id,
    pse.earning_type, 
    pse.earning_name,
    pse.earning_type_code, 

        CASE 
            WHEN pse.calculation_type = 'Flat Amount' THEN 'Flat Amount;' 
            ELSE concat(pse.calculation_percentage, "% Of ", pse.earning_type)
        END AS calculation_value,
    case 
    	when pse.consider_for_epf = 1 then 'Yes'
    	else 'No'
    end as consider_for_epf,
    case
    	when pse.consider_for_esi = 1 then 'Yes'
    	else 'No'
    end as consider_for_esi,
    
    CASE 
        WHEN pse.is_active = true THEN 'Active' 
        ELSE 'Inactive' 
    END AS is_active
FROM 
    PAYROLL_SLRYCOMPONENT_EARNING pse 
   `)

        if (list.length <= 0) {
            return res.status(400).send({status: false,message: "No list found", data: list});
        }

        return res.status(200).send({status: true,message: "Listed successfully",data: list});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};


exports.getAllSlryCompEarningUnformatedData = async (req, res) => {
    try {
        // const { entityType, financialYear } = req.query;
        const [list] = await db.sequelize.query(`
        SELECT * FROM PAYROLL_SLRYCOMPONENT_EARNING pse`)

        if (list.length <= 0) {
            return res.status(400).send({status: false,message: "No list found", data: list});
        }

        return res.status(200).send({status: true,message: "Listed successfully",data: list});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};

exports.getSlryCompEarningById = async (req, res) => {
    try {
        // const { entityType, financialYear } = req.query;
        const id = req.params.id;
        const [list] = await db.sequelize.query(`
    SELECT * FROM PAYROLL_SLRYCOMPONENT_EARNING pse WHERE id = ${id} ;`);

        if (list.length <= 0) {
            return res.status(400).send({status: false,message: "List Not Found", data: list});
        }

        return res.status(200).send({status: true,message: "Listed successfully",data: list[0]});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};


exports.updateSlryCompEarning = async (req, res) => {
    try {
        const id = req.params.id;
        // const { entityType, financialYear } = req.query;

        const existingData = await SalaryComponentEarningModel.findOne({ where: { id,  } });
        if (!existingData) {
            return res.status(404).send({ status: false, message: "Record not found" });
        }

       const updated = await SalaryComponentEarningModel.update(
            { ...req.body}, 
            { where: { id: existingData.id } }
        );

        return res.status(200).send({ status: true, message: "Updated Successfully", data:updated});

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};


exports.updateSlryCompEarningStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const existingData = await SalaryComponentEarningModel.findByPk(id);
        if (!existingData) {
            return res.status(404).send({ status: false, message: "Record not found" });
        }

        await SalaryComponentEarningModel.update(
            { is_active: status }, 
            { where: { id: existingData.id } }
        );

        return res.status(200).send({ status: true, message: "Updated Successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};

exports.getAllCreatedSlryCompEarning = async (req, res) => {
    try {
        // const { entityType, financialYear } = req.query;
        // const [list] = await db.sequelize.query(`
        // SELECT pse.id,pse.earning_type_code, pse.earning_name FROM PAYROLL_SLRYCOMPONENT_EARNING pse
        // WHERE is_active = true ;`)

        const list = []

        list.push({"earning_name":'Gross Salary', 'earning_type_code': 'gross_salary'}, {"earning_name":'N/A', "earning_type_code":'N/A'})

        if (list.length <= 0) {
            return res.status(400).send({status: false,message: "No list found", data: list});
        }

        return res.status(200).send({status: true,message: "Listed successfully",data: list});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};