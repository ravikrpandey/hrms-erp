const db = require("../../../models/index");
const logger = require('../../../../logger/index');
const { Op } = require("sequelize");

module.exports.generate_cost_center_code = async (req, res) => {
    try {
        const { department_id, region_id, cost_center_name } = req.body;

        if (!department_id || !region_id || !cost_center_name) {
            return res.status(400).send({ code: 400, message: "Missing required fields", data: null });
        }

        const department = await db.department.findOne({
            where: { dept_id: department_id, status: "ACTIVE", isDeleted: false },
            attributes: ["cc_code"]
        });

        if (!department) {
            return res.status(404).send({ code: 404, message: "Department not found", data: null });
        }

        const region = await db.regionMaster.findOne({
            where: { id: region_id, status: "ACTIVE", isDeleted: false },
            attributes: ["region_code"]
        });

        if (!region) {
            return res.status(404).send({ code: 404, message: "Region not found", data: null });
        }

        const lastEntry = await db.cost_center.findOne({
            where: { department_id, region_id },
            order: [['createdAt', 'DESC']],
            attributes: ["cost_center_code"]
        });

        let number;
        if (lastEntry) {
            const lastCode = lastEntry.cost_center_code;
            const lastNumber = parseInt(lastCode.slice(-3), 10);
            number = lastNumber + 1;
        } else {
            number = 100;
        }

        const costCenterCode = `${department.cc_code}${region.region_code}${number}`;

        return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: costCenterCode });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.create_cost_center = async (req, res) => {
    try {
   
        let {
            department_id, cost_center_name, type, parent_cost_center_id, financial_year_id, cost_center_code, budget_amount, date, cost_centre_type, currency_id, employee_id, manager_id,
            expense_type, valid_from, valid_to,cost_profit_center_name, status, is_group, budget_utilized, remaining_budget, parent_cost_center, id
            , extend_type ,amount} = req.body;
           
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id);
        let cost_profit_center_id = null;
        let finalType = null;

       if (typeof type === "number") {

    cost_profit_center_id = type;

} else if (typeof type === "string") {

    finalType = type;

}
        if(department_id){
        const department = await db.department.findOne({
            where: { dept_id: department_id, status: "ACTIVE", isDeleted: false },
        });
        if (!department) {
            return res.status(404).send({ code: 404, message: "Department not found", data: null });
        }
       
 
        if (!id) {
            const isExistCCName = await db.cost_center.findOne({
                where: {
                    department_id,
                    [Op.or]: [
                        { cost_center_name },
                        { cost_center_code }
                    ],
                    isDeleted: false
                }
            });
        
            if (isExistCCName) {
                return res.status(409).send({ code: 409, message: "Cost Center Name or Code already exists!", data: null });
            }
        }
    }
        let createData;
        let updatedAmount;
        let updatedRemainingAmount;

      
        if (!extend_type) {
            createData = await db.cost_center.create({
                department_id, entity_id, cost_center_name, cost_center_type: type,type, cost_center_code, amount: budget_amount, date, cost_center_type: cost_centre_type,financial_year_id,manager_id,type,
                expense_type, valid_from,cost_profit_center_id, cost_profit_center_name,valid_to, status, is_group, currency_id, employee_id, budget_utilized, remainingAmount:remaining_budget, parent_cost_center,parent_cost_center_id
            });
            return res.status(200).send({ code: 200, message: "Cost center created successfully", data: createData });
        } else {
            const findData = await db.cost_center.findOne({
                where: {
                    id,
                    department_id,
                    financial_year_id,
                    isDeleted: false
                }
            });
            if (!findData) {
                return res.status(404).send({ code: 404, message: "Cost center not found" });
            }
            if (extend_type === "Increase") {
                updatedAmount = parseFloat(findData.amount) + parseFloat(amount);
                updatedRemainingAmount = parseFloat(findData.remainingAmount) + parseFloat(amount);
            } else if (extend_type === "Decrease") {
                updatedAmount = parseFloat(findData.amount) - parseFloat(amount);
                updatedRemainingAmount = parseFloat(findData.remainingAmount) - parseFloat(amount);
            } else {
                return res.status(400).send({ code: 400, message: "Invalid extend_type" });
            }

            await db.cost_center.update({
                amount: updatedAmount,
                remainingAmount: updatedRemainingAmount,
                extend_type,
            }, {
                where: {
                    id: findData.id
                }
            });

            await db.cost_center_map.create({
                cost_center_id: findData.id, cost_amount: amount, cost_center_type:type,
                extend_type,remaining_cost_amount:updatedRemainingAmount
            });

            return res.status(200).send({ code: 200, message: "Cost center updated successfully" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server error" });
    }
};

exports.getAll_Active_Cost_Center = async (req, res) => {
    try {
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id);

        let sqlQuery = `
                SELECT FC.id AS cost_center_id,FC.cost_center_name, FC.cost_center_type ,FC.status AS cost_center_status,
                FC.createdAt AS cost_center_createdAt,
                FC.updatedAt AS cost_center_updatedAt,FC.cost_center_code,FC.remainingAmount,FC.amount,FC.financial_year_id,
                MD.dept_id,MD.department_name,MD.department_code,FY.financial_year,
                MD.cc_code,MR.id AS region_id,MR.region_name,MR.region_code
                FROM FINANCE_COST_CENTER FC
                JOIN MASTER_DEPARTMENT MD ON FC.department_id = MD.dept_id AND MD.isDeleted = false
                JOIN MASTER_REGION MR ON FC.region_id = MR.id AND MR.isDeleted = false
                JOIN MASTER_FINANCIAL_YEAR  FY ON FY.id = FC.financial_year_id AND FY.isDeleted = false
                WHERE FC.isDeleted = false AND FC.status = 'ACTIVE'
        `;

        const queryParams = [];

        if (!isNaN(entity_id)) {
            sqlQuery += ' AND FC.entity_id = ?';
            queryParams.push(entity_id);
        }

        sqlQuery += ' ORDER BY FC.cost_center_code ASC';

        const results = await db.sequelize.query(sqlQuery, {
            replacements: queryParams,
            type: db.sequelize.QueryTypes.SELECT
        });

        if (results.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: results });
        } else {
            return res.status(200).send({ code: 404, message: "Record Not Found", data: results });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAll_Cost_Center = async (req, res) => {
    try {
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id);

        let sqlQuery = `
            SELECT 
                FC.id AS cost_center_id,
                FC.cost_center_name,
                FC.cost_center_type,
                FC.status AS cost_center_status,
                FC.createdAt AS cost_center_createdAt,
                FC.updatedAt AS cost_center_updatedAt,
                FC.cost_center_code,
                FC.remainingAmount,
                FC.amount,
                FC.department_id,
                MD.department_name,
                MD.department_code,
                MD.cc_code
            FROM FINANCE_COST_CENTER FC
            LEFT JOIN MASTER_DEPARTMENT MD ON FC.department_id = MD.dept_id AND MD.isDeleted = false
             INNER JOIN MASTER_FINANCIAL_YEAR  FY ON FY.id = FC.financial_year_id AND FY.isDeleted = false
           
            WHERE FC.isDeleted = false
        `;

        const queryParams = [];

        if (!isNaN(entity_id)) {
            sqlQuery += ' AND FC.entity_id = ?';
            queryParams.push(entity_id);
        }

        sqlQuery += ' ORDER BY FC.id DESC';

        const results = await db.sequelize.query(sqlQuery, {
            replacements: queryParams,
            type: db.sequelize.QueryTypes.SELECT
        });

        if (results.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: results });
        } else {
            return res.status(200).send({ code: 404, message: "Record Not Found", data: results });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.get_Cost_Center_ById = async (req, res) => {
    try {
        const costCenterId = req.params.id;
        const [cost_center] = await db.sequelize.query(`
			    SELECT FC.*,MD.department_name,FY.financial_year
                FROM FINANCE_COST_CENTER AS FC
                LEFT JOIN MASTER_DEPARTMENT MD ON FC.department_id = MD.dept_id
                LEFT JOIN MASTER_REGION MR ON FC.region_id = MR.id
                INNER JOIN MASTER_FINANCIAL_YEAR  FY ON FY.id = FC.financial_year_id
                WHERE FC.isDeleted = false AND FC.id = ${costCenterId}
                ORDER BY FC.cost_center_code ASC`)

        const [cost_center_map] = await db.sequelize.query(`
        SELECT FM.*,FC.amount,FC.remainingAmount
		FROM FINANCE_COST_CENTER_MAPPING AS FM 
        JOIN FINANCE_COST_CENTER AS FC ON FC.id = FM.cost_center_id
        WHERE  FM.cost_center_id =  ${costCenterId}
        `)

        const PO_purchase_details = await db.purchase_order.findAll({
            where: {
                cost_center_id: costCenterId,final_status:'APPROVED'
            }
        });


        const countPo = await PO_purchase_details.reduce((a, b) => {
            a += b.total_purchase; 
            return a;
        }, 0)
        const finalTotal =  parseFloat(countPo).toFixed(2)
        const remaining_budget = parseFloat(cost_center[0].remainingAmount) - parseFloat(finalTotal);
        cost_center[0].remainingAmount = remaining_budget;
        cost_center[0].used_budget_amount = parseFloat(countPo)
        const Obj = {
            ...cost_center[0],
            cost_center_map,
        }

       

        if (cost_center.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: Obj });
        }


        if (cost_center_map.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: cost_center_map });
        }

        return res.status(200).send({ code: 404, message: "Record not found", data: null });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.update_cost_center = async (req, res) => {
    try {
        const costCenterId = req.params.id;
        const {
            department_id, cost_center_name, type, parent_cost_center_id, financial_year_id, 
            cost_center_code, budget_amount, date, cost_centre_type, currency_id, employee_id, 
            manager_id, expense_type, valid_from, valid_to, cost_profit_center_name, status, 
            is_group, budget_utilized, remaining_budget, parent_cost_center, extend_type, amount
        } = req.body;

        const { entity_id } = req.query;

        const updateData = {};

        if (department_id !== undefined) updateData.department_id = department_id;
        if (entity_id !== undefined) updateData.entity_id = parseInt(entity_id);
        if (cost_center_name !== undefined) updateData.cost_center_name = cost_center_name;
        if (cost_center_code !== undefined) updateData.cost_center_code = cost_center_code;
        if (budget_amount !== undefined) updateData.amount = budget_amount;
        if (date !== undefined) updateData.date = date;
        if (cost_centre_type !== undefined) updateData.cost_center_type = cost_centre_type;
        if (financial_year_id !== undefined) updateData.financial_year_id = financial_year_id;
        if (manager_id !== undefined) updateData.manager_id = manager_id;
        if (type !== undefined) updateData.type = type;
        if (expense_type !== undefined) updateData.expense_type = expense_type;
        if (valid_from !== undefined) updateData.valid_from = valid_from;
        if (valid_to !== undefined) updateData.valid_to = valid_to;
        if (cost_profit_center_name !== undefined) updateData.cost_profit_center_name = cost_profit_center_name;
        if (status !== undefined) updateData.status = status;
        if (is_group !== undefined) updateData.is_group = is_group;
        if (currency_id !== undefined) updateData.currency_id = currency_id;
        if (employee_id !== undefined) updateData.employee_id = employee_id;
        if (budget_utilized !== undefined) updateData.budget_utilized = budget_utilized;
        if (remaining_budget !== undefined) updateData.remainingAmount = remaining_budget;
        if (parent_cost_center !== undefined) updateData.parent_cost_center = parent_cost_center;
        if (parent_cost_center_id !== undefined) updateData.parent_cost_center_id = parent_cost_center_id;

        if (extend_type && amount) {
            let updatedAmount;
            let updatedRemainingAmount;

            if (extend_type === "Increase") {
                updatedAmount = parseFloat(existingCostCenter.amount) + parseFloat(amount);
                updatedRemainingAmount = parseFloat(existingCostCenter.remainingAmount) + parseFloat(amount);
            } else if (extend_type === "Decrease") {
                updatedAmount = parseFloat(existingCostCenter.amount) - parseFloat(amount);
                updatedRemainingAmount = parseFloat(existingCostCenter.remainingAmount) - parseFloat(amount);
            } else {
                return res.status(400).send({ code: 400, message: "Invalid extend_type" });
            }

            updateData.amount = updatedAmount;
            updateData.remainingAmount = updatedRemainingAmount;

            await db.cost_center_map.create({
                cost_center_id: existingCostCenter.id,
                cost_amount: amount,
                cost_center_type: type || existingCostCenter.type,
                extend_type: extend_type,
                remaining_cost_amount: updatedRemainingAmount
            });
        }

        await db.cost_center.update(updateData, {
            where: { id: costCenterId }
        });

        const updatedCostCenter = await db.cost_center.findOne({
            where: { id: costCenterId, isDeleted: false }
        });

        return res.status(200).send({
            code: 200,
            message: "Cost center updated successfully",
            data: updatedCostCenter
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server error" });
    }
};

exports.update_cost_center_status = async (req, res) => {
    try {
        const costCenterId = req.params.id;
        const { status } = req.body;
        await db.cost_center.update({ status: status }, { where: { id: costCenterId } });
        return res.status(200).send({ code: 200, message: "Status Updated Successfully" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.delete_Cost_Center_ById = async (req, res) => {
    try {
        const costCenterId = req.params.id;

        let isExist = await db.cost_center.findOne({ where: { id: costCenterId } })
        if (isExist) {
            if (isExist.isDeleted === true) {
                return res.status(400).send({ code: 400, message: "Cost Center Already Deleted!" })
            }

            let destroy = await db.cost_center.update({ isDeleted: true }, { where: { id: costCenterId } })
            return res.status(200).send({ code: 200, message: "Deleted Successfully" })
        }

        return res.status(200).send({ code: 404, message: "Record not found", data: null });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.get_all_cost = async (req, res) => {
    try {
        const { dept_id } = req.params;
        let { entity_id } = req.query;

        entity_id = entity_id ? parseInt(entity_id) : null;

        const department = await db.department.findOne({
            where: { dept_id: dept_id, status: 'ACTIVE' },
            attributes: ['dept_id']
        });
        if (!department) {
            return res.status(404).send({
                code: 404,
                message: "Department not found"
            });
        }

        const whereClause = {
            department_id: dept_id,
            status: 'ACTIVE'
        };

        if (entity_id) {
            whereClause.entity_id = entity_id;
        }

        const areas = await db.cost_center.findAll({
            where: whereClause,
            attributes: ['id', 'cost_center_name', 'cost_center_code']
        });

        if (areas.length > 0) {
            return res.status(200).send({ code: 200, message: `Found ${areas.length} cost center(s) for department: ${department.dept_id}`, data: areas });
        } else {
            return res.status(200).send({ code: 404, message: "No cost centers found for this department" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};



exports.getCostCenterHierarchyViewData = async (req, res) => {
    try {
        const { entity_id } = req.query;

        const [costCenterHierarchyView] = await db.sequelize.query(`
            SELECT  id,cost_center_name AS name, type,parent_cost_center_id
            FROM FINANCE_COST_CENTER 
            WHERE  isDeleted = '0' AND status = 'ACTIVE' AND entity_id = ${entity_id}
            ORDER BY id DESC`)

        const accountMap = {};
        costCenterHierarchyView.forEach(account => {
            account.children = [];
            accountMap[account.id] = account;
        });

        const rootAccounts = [];
        costCenterHierarchyView.forEach(account => {
            if (account.parent_cost_center_id === null || account.parent_cost_center_id === '') {
                rootAccounts.push(account);
            } else {
                const parent = accountMap[account.parent_cost_center_id];
                if (parent) {
                    parent.children.push(account);
                }
            }
        });


        const response = {
            costCenterHierarchyView: rootAccounts,
        };

        return res.status(200).send({ code: 200, message: 'success', data: response });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }



};

module.exports.getAllCostCenterIsGroup = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const dataList = await db.cost_center.findAll({ where: { is_group: 'YES', entity_id }, attributes: ['id', 'cost_center_name', 'cost_center_code'] })
        if (dataList) {
            return res.status(200).send({ code: 200, messege: 'sucess', data: dataList })
        } else {
            return res.status(200).send({ code: 404, messege: 'Data Not Found' })
        }
    } catch (error) {
        return res.status(500).send({ code: 500, messege: error.messege })
    }
}

module.exports.getAllTdsRegisterData = async (req, res) => {
    try {     
        const { entity_id } = req.query;        
        const [dataList] = await db.sequelize.query(`
            SELECT DISTINCT 
                P.posting_date AS createdAt,
                P.taxable AS net_taxable,
                P.sgst,
                P.cgst,
                P.igst,
                P.gstTotal,
                (P.taxable + P.gstTotal) AS gross_total,
                P.net AS net_total,
                NULL AS tds_amount,
                NULL AS rcmLiability,
                P.id,
                VB.vendor_name,
                VB.pan_number,
                VB.vendor_code,
                ST.section,
                ST.nature,
                TLM.nature_of_transaction,
                TLM.rate,
                P.updatedAt,
                P.document_number AS reference_number,
                'Purchase Journal' AS document_type,
                P.tdsAmt AS tds_rate_amount
            FROM PURCHASE_JOURNAL AS P
            INNER JOIN VENDOR_BASIC_DETAILS AS VB ON P.vendor_id = VB.id
            INNER JOIN SYS_TDS_MST AS ST ON P.tds_id = ST.id
            INNER JOIN TDS_LIST_MST AS TLM ON P.tds_id = TLM.tds_id
            WHERE P.vendor_id IS NOT NULL 
              AND P.tds_id IS NOT NULL 
              AND P.entity_id = ${entity_id}
            GROUP BY P.id
        
            UNION ALL
        
            SELECT DISTINCT 
                P.posting_date AS createdAt,
                P.taxable AS net_taxable,
                P.sgst,
                P.cgst,
                P.igst,
                P.gstTotal,
                P.gross AS gross_total,
                P.net AS net_total,
                P.tdsAmt AS tds_amount,
                P.rcmLiability,
                P.id,
                VB.vendor_name,
                VB.pan_number,
                VB.vendor_code,
                ST.section,
                ST.nature,
                TLM.nature_of_transaction,
                TLM.rate,
                P.updatedAt,
                P.document_number AS reference_number,
                'Purchase Service Voucher' AS document_type,
                P.tdsAmt AS tds_rate_amount
            FROM PURCHASE_SERVICE_VOUCHER AS P
            INNER JOIN VENDOR_BASIC_DETAILS AS VB ON P.vendor_id = VB.id
            INNER JOIN SYS_TDS_MST AS ST ON P.tds_id = ST.id
            INNER JOIN TDS_LIST_MST AS TLM ON P.tds_id = TLM.tds_id
            WHERE P.vendor_id IS NOT NULL 
              AND P.tds_id IS NOT NULL 
              AND P.entity_id = ${entity_id}
            GROUP BY P.id 
        
            UNION ALL
        
            SELECT DISTINCT
                P.grn_date AS createdAt,
                P.total_amount AS net_taxable,
                P.sgst,
                P.cgst,
                P.igst,
                P.total_gst_amount AS gstTotal,
                P.total_amount AS gross_total,
                P.grand_total AS net_total,
                P.tds_amount AS tds_amount,
                NULL AS rcmLiability,
                P.id,
                VB.vendor_name,
                VB.pan_number,
                VB.vendor_code,
                ST.section,
                ST.nature,
                TLM.nature_of_transaction,
                TLM.rate,
                P.updatedAt,
                P.invoiceNo AS reference_number,
                'Purchase Invoice' AS document_type,
                P.tds_amount AS tds_rate_amount
            FROM GRN_MASTER AS P
            INNER JOIN PAYMENT_PROGRAM_LIST AS PL ON PL.invoice_id = P.id
            INNER JOIN VENDOR_BASIC_DETAILS AS VB ON P.vendor_id = VB.id
            INNER JOIN SYS_TDS_MST AS ST ON PL.tds_id = ST.id
            INNER JOIN TDS_LIST_MST AS TLM ON PL.tds_id = TLM.tds_id
            WHERE PL.vendor_id IS NOT NULL
              AND PL.tds_id IS NOT NULL
              AND P.entity_id = ${entity_id}
            GROUP BY P.id
            ORDER BY updatedAt DESC
        `)
           if(dataList){
            return res.status(200).send({code:200,data:dataList})
           }else{
            return res.status(200).send({ code: 404, messege: 'Data Not Found' })

           }
    } catch (error) {
        return res.status(500).send({ code: 500, messege: error.messege })
    }
}

module.exports.generateFinanceCostCenterCode = async (req, res) => {
    try {
        const { entity_id} = req.query;

        const entityExist = await db.entityMaster.findOne({where:{id:entity_id},attributes:['id','entity_name']})
        const lastEntry = await db.cost_center.findOne({ where:{entity_id},
            order: [["createdAt", "DESC"]],
            attributes: ["id","cost_center_code"],
        });
    
        let number;
        const currentYear = new Date().getFullYear();
        const currentPrefix = currentYear.toString().slice(2);
      
        if (lastEntry) {
          const newCode = `${entityExist.entity_name}-CC-${currentPrefix}-${lastEntry.id}`;
          number = newCode;
          
        } else {
          number = `${entityExist.entity_name}-CC-${currentPrefix}-00001`;
          
        }

        return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: number });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};