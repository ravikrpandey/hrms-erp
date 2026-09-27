const db = require("../../../models/index");



/////////////// Create Declaration Form ///////////////

exports.createDeclarationForm = async (req, res) => {
    try {
        const { entity_id, login_id, saving_amout,declaration_form, financial_year_id } = req.body;
        let isExistYear = await db.payroll_declaration_form.findOne({where: {financial_year_id : financial_year_id, login_id: login_id,isDeleted: false}})
        if(isExistYear){
            return res.status(400).send({code: 400, message: "Form already Exist in this year!"})
        }
       
        const response = await db.payroll_declaration_form.create({
            declaration_form,
            financial_year_id,
            login_id,
            entity_id,
            saving_amout,
            declaration_form: declaration_form
        });
        return res.status(200).send({ code: 200, message: "Declaration Form uploaded Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

/////////////// Edit Declaration Form ///////////////

exports.editDeclarationForm = async (req, res) => {
    try {
        const id = req.params.id;
        const DeclarationFormData = await db.payroll_declaration_form.findOne({ where: { id: id } });
        if (DeclarationFormData) {
            const updateData = await db.payroll_declaration_form.update(req.body, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Form Updated Successfully", data: updateData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};



exports.getByIdDeclarationForm = async (req, res) => {
    try {
        const { id } = req.params;
        const { entity_id, financial_year_id } = req.query; // Get filters from query params

        let query = `
            SELECT 
                pd.*, mf.financial_year,  em.entity_name,
                CONCAT(ru.first_name, ' ', ru.last_name) AS employee_name, ru.employee_code
            FROM PAYROLL_DECLARATION_FORM pd
            INNER JOIN MASTER_FINANCIAL_YEAR mf ON pd.financial_year_id = mf.id
            INNER JOIN HRMS_REGISTERED_USER ru ON pd.login_id = ru.employee_id
            LEFT JOIN ENTITY_MASTER em ON pd.entity_id = em.id
            WHERE pd.id = :id AND pd.isDeleted = false
        `;

        if (entity_id) {
            query += ` AND pd.entity_id = :entity_id`;
        }
        if (financial_year_id) {
            query += ` AND pd.financial_year_id = :financial_year_id`;
        }

        const result = await db.sequelize.query(query, {
            replacements: { id, entity_id, financial_year_id },
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (result.length) {
            const transformedData = result.map(item => {
                const startYear = parseInt(item.financial_year); // Assuming financial_year is a string
                const endYear = startYear + 1;
                return {
                    ...item, // No need for toJSON
                    financial_year_range: `${startYear}-${endYear.toString().slice(-2)}`, // e.g., "2024-25"
                };
            });
            return res.status(200).send({ code: 200, message: "Data fetched successfully", data: transformedData });
        } else {
            return res.status(404).send({ code: 404, message: "Record not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Internal server error" });
    }
};


exports.getAllDeclarationForm_approvalData = async (req, res) => {
    try {
        // const { entity_id, financial_year_id } = req.query; // Get filters from query params

        // Start building the query
        let query = `
            SELECT 
                pd.*, mf.financial_year,  em.entity_name,
                CONCAT(ru.first_name, ' ', ru.last_name) AS employee_name, ru.employee_code
            FROM PAYROLL_DECLARATION_FORM pd
            INNER JOIN MASTER_FINANCIAL_YEAR mf ON pd.financial_year_id = mf.id
            INNER JOIN HRMS_REGISTERED_USER ru ON pd.login_id = ru.employee_id
            LEFT JOIN ENTITY_MASTER em ON pd.entity_id = em.id
            WHERE pd.isDeleted = false AND pd.approval_status= 'APPROVED'
        `;

        // Apply filters if present
        // if (entity_id) {
        //     query += ` AND pd.entity_id = :entity_id`;
        // }
        // if (financial_year_id) {
        //     query += ` AND pd.financial_year_id = :financial_year_id`;
        // }

        // Execute the query
        const result = await db.sequelize.query(query, {
            // replacements: { entity_id, financial_year_id },
            type: db.Sequelize.QueryTypes.SELECT
        });

        // Check if any results are found
        if (result.length) {
            const transformedData = result.map(item => {
                const startYear = parseInt(item.financial_year); // Assuming financial_year is a string
                const endYear = startYear + 1;
                return {
                    ...item, // No need for toJSON
                    financial_year_range: `${startYear}-${endYear.toString().slice(-2)}`, // e.g., "2024-25"
                };
            });
            return res.status(200).send({ code: 200, message: "Data fetched successfully", data: transformedData });
        } else {
            return res.status(404).send({ code: 404, message: "No records found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Internal server error" });
    }
};


exports.getAllDeclarationForm_pendingData = async (req, res) => {
    try {
        // const { entity_id, financial_year_id } = req.query; // Get filters from query params

        // Start building the query
        let query = `
            SELECT 
                pd.*, mf.financial_year,  em.entity_name,
                CONCAT(ru.first_name, ' ', ru.last_name) AS employee_name, ru.employee_code
            FROM PAYROLL_DECLARATION_FORM pd
            INNER JOIN MASTER_FINANCIAL_YEAR mf ON pd.financial_year_id = mf.id
            INNER JOIN HRMS_REGISTERED_USER ru ON pd.login_id = ru.employee_id
            LEFT JOIN ENTITY_MASTER em ON pd.entity_id = em.id
            WHERE pd.isDeleted = false AND pd.approval_status= 'PENDING'
        `;

        // Apply filters if present
        // if (entity_id) {
        //     query += ` AND pd.entity_id = :entity_id`;
        // }
        // if (financial_year_id) {
        //     query += ` AND pd.financial_year_id = :financial_year_id`;
        // }

        // Execute the query
        const result = await db.sequelize.query(query, 
            {
            // replacements: { entity_id, financial_year_id},
            type: db.Sequelize.QueryTypes.SELECT
        });

        // Check if any results are found
        if (result.length) {
            const transformedData = result.map(item => {
                const startYear = parseInt(item.financial_year); // Assuming financial_year is a string
                const endYear = startYear + 1;
                return {
                    ...item, // No need for toJSON
                    financial_year_range: `${startYear}-${endYear.toString().slice(-2)}`, // e.g., "2024-25"
                };
            });
            return res.status(200).send({ code: 200, message: "Data fetched successfully", data: transformedData });
        } else {
            return res.status(404).send({ code: 404, message: "No records found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Internal server error" });
    }
};


exports.getAllDeclarationForm_rejectedData = async (req, res) => {
    try {
        // const { entity_id, financial_year_id } = req.query; // Get filters from query params

        // Start building the query
        let query = `
            SELECT 
                pd.*, mf.financial_year,  em.entity_name, 
                CONCAT(ru.first_name, ' ', ru.last_name) AS employee_name, ru.employee_code
            FROM PAYROLL_DECLARATION_FORM pd
            INNER JOIN MASTER_FINANCIAL_YEAR mf ON pd.financial_year_id = mf.id
            INNER JOIN HRMS_REGISTERED_USER ru ON pd.login_id = ru.employee_id
            LEFT JOIN ENTITY_MASTER em ON pd.entity_id = em.id
            WHERE pd.isDeleted = false AND pd.approval_status= 'REJECTED'
        `;

        // Apply filters if present
        // if (entity_id) {
        //     query += ` AND pd.entity_id = :entity_id`;
        // }
        // if (financial_year_id) {
        //     query += ` AND pd.financial_year_id = :financial_year_id`;
        // }

        // Execute the query
        const result = await db.sequelize.query(query, {
            // replacements: { entity_id, financial_year_id },
            type: db.Sequelize.QueryTypes.SELECT
        });

        // Check if any results are found
        if (result.length) {
            const transformedData = result.map(item => {
                const startYear = parseInt(item.financial_year); // Assuming financial_year is a string
                const endYear = startYear + 1;
                return {
                    ...item, // No need for toJSON
                    financial_year_range: `${startYear}-${endYear.toString().slice(-2)}`, // e.g., "2024-25"
                };
            });
            return res.status(200).send({ code: 200, message: "Data fetched successfully", data: transformedData });
        } else {
            return res.status(404).send({ code: 404, message: "No records found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Internal server error" });
    }
};


exports.getAllDeclarationForm_by_loginId = async (req, res) => {
    try {
        const { entity_id, financial_year_id, loginId } = req.query; // Get filters from query params
        let login_id = loginId;
        
        // Start building the query
        let query = `
        SELECT 
            pd.*, 
            mf.financial_year, 
            CONCAT(ru.first_name, ' ', ru.last_name) AS employee_name, 
            ru.employee_code
        FROM PAYROLL_DECLARATION_FORM pd
        INNER JOIN MASTER_FINANCIAL_YEAR mf ON pd.financial_year_id = mf.id
        INNER JOIN HRMS_REGISTERED_USER ru ON pd.login_id = ru.employee_id
        WHERE pd.isDeleted = false
        `;

        // Apply filters if present
        if (login_id) {
            query += ` AND pd.login_id = :login_id`;
        }
        if (entity_id) {
            query += ` AND pd.entity_id = :entity_id`;
        }

        // Execute the query
        const result = await db.sequelize.query(query, {
            replacements: { entity_id, financial_year_id, login_id },
            type: db.Sequelize.QueryTypes.SELECT
        });

        // Check if any results are found
        if (result.length) {
            const transformedData = result.map(item => {
                const startYear = parseInt(item.financial_year); // Assuming financial_year is a string
                const endYear = startYear + 1;
                return {
                    ...item, // No need for toJSON
                    financial_year_range: `${startYear}-${endYear.toString().slice(-2)}`, // e.g., "2024-25"
                };
            });
            return res.status(200).send({ code: 200, message: "Data fetched successfully", data: transformedData });
        } else {
            return res.status(404).send({ code: 404, message: "No records found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Internal server error" });
    }
};




/////////////// Delete Declaration Form ///////////////

exports.deleteDeclarationForm = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const DeclarationFormData = await db.payroll_declaration_form.findOne({ where: { id: id } });
        if (DeclarationFormData) {
            await db.payroll_declaration_form.update({ isDeleted: true, status: "INACTIVE" }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!", });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


//////////////-- approval api -- /////////////////////

exports.payroll_DeclarationForm_approval_status = async (req, res) => {
    try {
        let { approval_id, remark, status, login_id , saving_amout} = req.body;
        console.log(req.body);

        if (status === "APPROVED") {
            const approvedData = await db.payroll_declaration_form.update(
                { approval_status: status, saving_amout : saving_amout, remark, approved_by: login_id },
                { where: { id: approval_id } }
            );
            if (approvedData[0] > 0) {
                return res.status(200).send({ code: 200, message: "Form Approved Successfully" });
            }
        } else if (status === "REJECTED") {
            const rejectData = await db.payroll_declaration_form.update(
                { approval_status: status, remark },
                { where: { id: approval_id } }
            );
            if (rejectData[0] > 0) {
                return res.status(200).send({ code: 200, message: "Form Rejected Successfully" });
            }
        }

        return res.status(400).send({ code: 400, message: "No matching record found to update" });

    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
};

