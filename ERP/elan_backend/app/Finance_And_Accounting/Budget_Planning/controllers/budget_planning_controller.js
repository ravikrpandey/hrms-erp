
const db = require("../../../models/index");
const logger = require('../../../../logger/index');

exports.create_budgetPlanning = async (req, res) => {
    try {
        const { budgetFinancialYear_id, budget_planning_type, nature_need, quantity, price_without_vat, vat, estimated_unit_price_with_vat, source_of_price, flight_insurance_transport, custom_duties, total_Value, justification_need, vat_classification, month, budgetCategory_id, expenseType_id, needType_id, user_id, location_id, currency_id, region_id, department_id } = req.body;

        let { entity_id } = req.query;
        entity_id = parseInt(entity_id);

        let savePlan = await db.budgetPlanning.create({
            entity_id: entity_id, budgetFinancialYear_id, budget_planning_type, nature_need, quantity, price_without_vat, vat, estimated_unit_price_with_vat, source_of_price, flight_insurance_transport, custom_duties, total_Value, justification_need, vat_classification, month, budgetCategory_id, expenseType_id, needType_id, user_id, location_id, currency_id, region_id, department_id
        })


        const getData = await db.WorkFlow_Master.findOne({
            where: {
                department_id: department_id,
                job_name: "Budget Planning",
                entity_id:entity_id,
                budget_planning_type:budget_planning_type,
                status: "ACTIVE"
            },
            attributes: ["id"]
        });

        if (!getData) {
            return res.status(400).send({
                code: 400,
                message: "Workflow is not created for required department and job!"
            });
        }

        const budgetPlanningId = savePlan.id;
        const dep_id = savePlan.department_id;

        const getLevels = await db.Work_Flow_range.findAll({
            where: {
                workflow_id: getData.id,
                status: "ACTIVE"
            },
            attributes: ["level", "employee_id", "role_id", "workflow_id"]
        });

        const levelPromises = getLevels.map(async (level) => {
            const createdLevel = await db.budget_approval.create({
                level: level.level,
                employee_id: level.employee_id,
                workflow_id: level.workflow_id,
                budgetPlanning_Id: budgetPlanningId,
                role_id: level.role_id,
                department_id: dep_id,
                login_id: user_id,
            });
            return createdLevel;
        });

        await Promise.all(levelPromises);

        return res.status(200).send({
            code: 200,
            message: 'Budget Planning Request created successfully',
            data: savePlan
        });


    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};


exports.bulk_approval_request = async (req, res) => {
    try {
        let {approval_data} = req.body; // if approval_data = [1,2,3,5,9,8,6]

        for (let i = 0; i < approval_data.length; i++) {
            let approval_id = approval_data[i].id;

            await db.budget_approval.update({
                approval_status: "PENDING"
            }, { where: { id: approval_id } });
        }

        return res.status(200).send({ code: 200, message: "Approval Request Sent Successfully" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Database query error: ", error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
};


exports.get_approval_request_by_departmentId = async (req, res) => {
    try {
        const { login_id, entity_id , budgetFinancialYear_id } = req.query;

        const approvalRequestsQuery = `
            SELECT 
                dept.department_name,
                dept.dept_id,
                COUNT(approval.id) AS total_request,
                SUM(budget.total_Value) AS total_amount,
                CONCAT(user.first_name, ' ', user.last_name) AS name
            FROM 
                FINANCE_BUDGET_PLANNING_APPROVAL approval
            JOIN 
                FINANCE_BUDGET_PLANNING budget ON approval.budgetPlanning_Id = budget.id
            JOIN 
                MASTER_DEPARTMENT dept ON approval.department_id = dept.dept_id
        
            JOIN 
                HRMS_REGISTERED_USER user ON approval.login_id = user.employee_id
            WHERE 
                approval.employee_id = :login_id 
                AND budget.entity_id = :entity_id 
                AND approval.approval_status = 'PENDING'
                AND budget.budgetFinancialYear_id = :budgetFinancialYear_id
            GROUP BY 
                dept.department_name, dept.dept_id, user.first_name, user.last_name
        `;

        const approvalRequests = await db.sequelize.query(approvalRequestsQuery, {
            replacements: { login_id, entity_id, budgetFinancialYear_id },
            type: db.sequelize.QueryTypes.SELECT
        });

        res.status(200).send({
            code: 200,
            message: "Approval Request Fetched Successfully",
            data: approvalRequests
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Database query error: ", error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
};


exports.getAll_budgetPlanning = async (req, res) => {
    try {
        const budget_planning_type = req.params.id;
        let { id, entity_id, approval_status, user_id, dept_id } = req.query;
        if (!budget_planning_type) {
            return res.status(400).json({ code: 400, message: "Budget planning type is required" });
        }

        if (!id) {
            return res.status(400).json({ code: 400, message: "Budget financial year is required" });
        }

        let conditions = `
            WHERE BP.isDeleted = false
            AND BP.budget_planning_type = :budget_planning_type
            AND BP.budgetFinancialYear_id = :id
        `;

        if (entity_id) {
            conditions += ` AND BP.entity_id = :entity_id`;
        }

        if (approval_status === 'PENDING') {
            conditions += `
                AND BPA.approval_status = 'PENDING'
                AND BPA.employee_id = :user_id
                AND BP.budget_planning_type = :budget_planning_type
                AND BPA.department_id = :dept_id
            `;
        } else if (approval_status === 'APPROVED') {
            conditions += `
                AND BPA.approval_status = 'APPROVED'
                AND BPA.employee_id = :user_id
                AND BP.budget_planning_type = :budget_planning_type
            `;
        } else if (approval_status === 'REJECTED') {
            conditions += `
                AND BPA.approval_status = 'REJECTED'
                AND BPA.employee_id = :user_id
                AND BP.budget_planning_type = :budget_planning_type
            `;
        } else {
            conditions += `
                AND BPA.login_id = :user_id
                AND BP.entity_id = :entity_id
                AND BP.budget_planning_type = :budget_planning_type
            `;
        }

        let query = `
            SELECT 
                BPA.id AS approval_id, 
                BPA.level,
                BPA.progress_status,
                BPA.status AS approval_status,
                BPA.isDeleted AS approval_isDeleted,
                BPA.createdAt AS approval_createdAt,
                BPA.updatedAt AS approval_updatedAt, 
                BPA.budgetPlanning_Id, 
                BPA.employee_id, 
                BPA.role_id, 
                BPA.level,
                BPA.remarks,
                BPA.workflow_id, 
                BPA.department_id AS approval_department_id, 
                BPA.approval_status,
                BP.id AS budget_id,
                BP.nature_need, 
                BP.price_without_vat, 
                BP.vat, 
                BP.budget_planning_type, 
                BP.estimated_unit_price_with_vat, 
                BP.source_of_price, 
                BP.flight_insurance_transport, 
                BP.custom_duties, 
                BP.total_Value, 
                BP.justification_need, 
                BP.vat_classification, 
                BP.month, 
                BP.status AS budget_status, 
                BP.isDeleted AS budget_isDeleted, 
                BP.createdAt AS budget_createdAt, 
                BP.updatedAt AS budget_updatedAt, 
                BP.budgetCategory_id, 
                BP.expenseType_id, 
                BP.needType_id, 
                BP.user_id, 
                BP.location_id, 
                BP.currency_id, 
                BP.region_id, 
                BP.quantity, 
                BP.budgetFinancialYear_id, 
                BP.entity_id, 
                BP.department_id,
                MFY.financial_year,
                MBC.budget_category AS budget_category_name,
                ME.expense_type,
                NT.need_type,
                DEPT.department_name,
                L.branch_name AS location,
                C.Currency_Type AS currency,
                R.region_name AS region
            FROM FINANCE_BUDGET_PLANNING BP
            LEFT JOIN FINANCE_BUDGET_PLANNING_APPROVAL BPA ON BP.id = BPA.budgetPlanning_Id
            LEFT JOIN MASTER_BUDGET_CATEGORY MBC ON BP.budgetCategory_id = MBC.id
            LEFT JOIN MASTER_EXPENSE ME ON BP.expenseType_id = ME.id
            LEFT JOIN MASTER_NEED NT ON BP.needType_id = NT.id
            LEFT JOIN HRMS_REGISTERED_USER U ON BP.user_id = U.employee_id
            LEFT JOIN MASTER_DEPARTMENT DEPT ON U.department_id = DEPT.dept_id
            LEFT JOIN MASTER_BRANCH L ON BP.location_id = L.id
            LEFT JOIN MASTER_CURRENCY_CONVERT C ON BP.currency_id = C.Currency_Convert_id
            LEFT JOIN MASTER_REGION R ON BP.region_id = R.id
            LEFT JOIN FINANCE_BUDGET_PLAN_DATE FBPD ON BP.budgetFinancialYear_id = FBPD.id
            LEFT JOIN MASTER_FINANCIAL_YEAR MFY ON FBPD.financial_year_id = MFY.id
            ${conditions}
            ORDER BY  
            CASE 
        WHEN BPA.approval_status = 'DRAFT' THEN 0 
        ELSE 1 
    END ASC,
    BP.createdAt ASC;
        `;

        const [data] = await db.sequelize.query(query, {
            replacements: { budget_planning_type, id, entity_id, approval_status, user_id, dept_id },
        });

        if (data.length > 0) {
            return res.status(200).json({ code: 200, message: "Budget Planning Fetched Successfully", data: data });
        } else {
            return res.status(404).json({ code: 404, message: "Record Not Found", data: [] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Database query error: ", error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
};




exports.getById_budgetPlanning = async (req, res) => {
    try {
        const { id } = req.params;

        const sqlQuery = `
           SELECT 
                BP.id, 
                BP.nature_need, 
                BP.price_without_vat, 
                BP.vat, 
                BP.estimated_unit_price_with_vat, 
                BP.source_of_price, 
                BP.flight_insurance_transport, 
                BP.custom_duties, 
                BP.total_Value, 
                BP.quantity, 
                BP.justification_need, 
                BP.vat_classification, 
                BP.month, 
                BP.budget_planning_type,
                BP.status, 
                BP.isDeleted, 
                BP.createdAt, 
                BP.updatedAt, 
                BP.budgetCategory_id, 
                MBC.budget_category,
                BP.expenseType_id, 
                ME.expense_type,
                BP.needType_id, 
                NT.need_type,
                BP.user_id, 
                BP.location_id, 
                L.branch_name,
                BP.currency_id, 
                C.Currency_Type,
                BP.region_id, 
                R.region_name,
                R.region_code,
                MD.department_name,
                BP.department_id,
                FBPA.remarks as remark,
                BP.budgetFinancialYear_id, 
                MFY.financial_year,
                MBC.budget_category as budget_category_name,
                ME.expense_type,
                NT.need_type,
                BP.cost_center_id,
                FCC.cost_center_name,
                L.branch_name as location,
                C.Currency_Type as currency,
                R.region_name as region
            FROM FINANCE_BUDGET_PLANNING BP
            INNER JOIN MASTER_BUDGET_CATEGORY MBC ON BP.budgetCategory_id = MBC.id
            INNER JOIN MASTER_EXPENSE ME ON BP.expenseType_id = ME.id
            INNER JOIN MASTER_NEED NT ON BP.needType_id = NT.id
            INNER JOIN HRMS_REGISTERED_USER U ON BP.user_id = U.employee_id
            INNER JOIN MASTER_BRANCH L ON BP.location_id = L.id
            INNER JOIN MASTER_CURRENCY_CONVERT C ON BP.currency_id = C.Currency_Convert_id
            INNER JOIN MASTER_REGION R ON BP.region_id = R.id
            INNER JOIN FINANCE_BUDGET_PLAN_DATE FBPD ON BP.budgetFinancialYear_id = FBPD.id
            INNER JOIN MASTER_FINANCIAL_YEAR MFY ON FBPD.financial_year_id = MFY.id
            LEFT JOIN FINANCE_COST_CENTER FCC ON BP.cost_center_id = FCC.id
            LEFT JOIN FINANCE_BUDGET_PLANNING_APPROVAL FBPA ON FBPA.budgetPlanning_Id = BP.id
            INNER JOIN MASTER_DEPARTMENT MD ON MD.dept_id = BP.department_id
            WHERE BP.isDeleted = false AND BP.id = :id
            ORDER BY BP.createdAt ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery, {
            replacements: { id: id }
        });

        if (data.length > 0) {
            return res.status(200).json({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).json({ code: 404, message: "Record Not Found", data: data });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Database query error: ", error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
};


exports.update_budgetPlanning = async (req, res) => {
    try {

        const { id } = req.params;
        const { budget_planning_type, nature_need, quantity, price_without_vat, vat, estimated_unit_price_with_vat, source_of_price, flight_insurance_transport, custom_duties, total_Value, justification_need, vat_classification, month, budgetCategory_id, expenseType_id, needType_id, user_id, location_id, currency_id, region_id, remark } = req.body;
        let remarks = remark;
        let budgetPlanning = await db.budgetPlanning.findOne({ where: { id: id } });

        if (!budgetPlanning) {
            return res.status(404).send({ code: 404, message: "Budget Planning Record Not Found" });
        }

        budgetPlanning = await budgetPlanning.update({
            nature_need,
            price_without_vat,
            vat,
            estimated_unit_price_with_vat,
            source_of_price,
            quantity,
            flight_insurance_transport,
            custom_duties,
            total_Value,
            justification_need,
            vat_classification,
            month,
            budget_planning_type,
            budgetCategory_id,
            expenseType_id,
            needType_id,
            user_id,
            location_id,
            currency_id,
            region_id,
        });

        if (remark) {
            let budgetPlanningRemark = await db.budget_approval.update({
                remarks: remarks
            }, { where: { budgetPlanning_Id: id } })
        }

        return res.status(200).send({ code: 200, message: "Budget Planning Updated Successfully", data: budgetPlanning });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.map_budget_planning_with_cc = async (req, res) => {
    try {

        const planning_id = req.params.id;
        const { cost_center_id, pushback, remark } = req.body;

        let remarks = remark;
        let budgetPlanning = await db.budgetPlanning.findOne({ where: { id: planning_id } });

        if (!budgetPlanning) {
            return res.status(404).send({ code: 404, message: "Budget Planning Record Not Found" });
        }

        if (pushback === true) {
            budgetPlanning = await db.budget_approval.update({
                approval_status: "REJECTED",
                remarks: remarks
            }, { where: { budgetPlanning_Id: planning_id } })
        } else if (pushback === false) {
            budgetPlanning = await db.budget_approval.update({
                approval_status: "APPROVED",
                remarks: remarks
            }, { where: { budgetPlanning_Id: planning_id } })
        }

        budgetPlanning = await db.budgetPlanning.update({
            cost_center_id,
        }, { where: { id: planning_id } });

        return res.status(200).send({ code: 200, message: "Budget Planning Mapped with CC Successfully", data: budgetPlanning });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



