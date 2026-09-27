const db = require("../../../models/index");
const Sequelize = require("sequelize");
const workFlow = db.WorkFlow_Master

exports.create_work_Flow = async (req, res) => {
    try {
        const { roleFiled, department_id, job_name, budget_planning_type, entity_id,  } = req.body;
        const roleFiledValue = roleFiled;
        let createWorkFlow;
        if (job_name === "Budget Planning") {
            const existData = await db.WorkFlow_Master.findOne({
                where: { department_id, job_name, budget_planning_type, status: "ACTIVE", isDeleted: false, entity_id: entity_id }
            });

            if (existData) {
                return res.status(400).json({ code: 400, message: "WorkFlow Already Exists" });
            }

            createWorkFlow = await workFlow.create({
                department_id,
                job_name,
                budget_planning_type,
                entity_id,
            })
        } else if (job_name === "Item") {
            const existData = await db.WorkFlow_Master.findOne({
                where: { department_id, job_name, status: "ACTIVE", isDeleted: false, entity_id: entity_id }
            });

            if (existData) {
                return res.status(400).json({ code: 400, message: "WorkFlow Already Exists" });
            }

            createWorkFlow = await workFlow.create({
                department_id,
                job_name,
                entity_id,
              
            })
        }
         else if (job_name === "Service") {
            const existData = await db.WorkFlow_Master.findOne({
                where: { department_id, job_name, status: "ACTIVE", isDeleted: false, entity_id: entity_id }
            });

            if (existData) {
                return res.status(400).json({ code: 400, message: "WorkFlow Already Exists" });
            }

            createWorkFlow = await workFlow.create({
                department_id,
                job_name,
                entity_id,
            })
        }else if (job_name === "Item_PO") {
            const existData = await db.WorkFlow_Master.findOne({
                where: { department_id, job_name, status: "ACTIVE", isDeleted: false, entity_id: entity_id }
            });

            if (existData) {
                return res.status(400).json({ code: 400, message: "WorkFlow Already Exists" });
            }

            createWorkFlow = await workFlow.create({
                department_id,
                job_name,
                entity_id,
              
            })
        }
         else if (job_name === "Service_PO") {
            const existData = await db.WorkFlow_Master.findOne({
                where: { department_id, job_name, status: "ACTIVE", isDeleted: false, entity_id: entity_id }
            });

            if (existData) {
                return res.status(400).json({ code: 400, message: "WorkFlow Already Exists" });
            }

            createWorkFlow = await workFlow.create({
                department_id,
                job_name,
                entity_id,
            })
        }
        else if (job_name === "LMS Course") {
            const existData = await db.WorkFlow_Master.findOne({
                where: { department_id, job_name, status: "ACTIVE", isDeleted: false, entity_id: entity_id }
            });

            if (existData) {
                return res.status(400).json({ code: 400, message: "WorkFlow Already Exists" });
            }

            createWorkFlow = await workFlow.create({
                department_id,
                job_name,
                entity_id,
            })
        }
        else {
            const existData = await db.WorkFlow_Master.findOne({
                where: { department_id, job_name, status: "ACTIVE", isDeleted: false, entity_id: entity_id }
            });

            if (existData) {
                return res.status(400).json({ code: 400, message: "WorkFlow Already Exists" });
            }

            createWorkFlow = await workFlow.create({
                department_id,
                job_name,
                entity_id,
            })
        }

        if (roleFiledValue && roleFiledValue.length > 0) {
            const seenRoleWorkflowEmployee = new Set();

            for (let i = 0; i < roleFiledValue.length; i++) {
                const { role_id, employee_id, level } = roleFiledValue[i];
                const key = `${role_id}_${createWorkFlow.id}_${employee_id}`;

                if (seenRoleWorkflowEmployee.has(key)) {
                    return res.status(400).json({ code: 400, message: "Duplicate combination of roleId, workflowId, and employeeId found in roleFiledValue" });
                }

                await db.WorkFlow_Map.create({
                    workflow_id: createWorkFlow.id,
                    role_id: roleFiledValue[i].role_id,
                    employee_id: roleFiledValue[i].employee_id,
                });

                await db.Work_Flow_range.create({
                    workflow_id: createWorkFlow.id,
                    role_id: roleFiledValue[i].role_id,
                    employee_id: roleFiledValue[i].employee_id,
                    level: roleFiledValue[i].level,
                });

                seenRoleWorkflowEmployee.add(key);
            }
        }

        return res.status(200).json({ code: 200, message: "Work Flow Created Successfully!", data: createWorkFlow });
    } catch (error) {
        console.error("Error in create_work_Flow:", error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
};

exports.view_workflow_byId = async (req, res) => {
    try {
        const workFlowId = req.params.id;

        const workFlowData = await db.WorkFlow_Master.findOne({ where: { id: workFlowId, status: "ACTIVE" } });

        if (!workFlowData) {
            return res.status(404).json({ code: 404, message: "Record Not Found" });
        }

        const query = `
        SELECT DISTINCT wf.id, dp.department_name, EW.level,wf.budget_planning_type,
        R.first_name, R.last_name, M.role_master_name, EW.status, wf.job_name, wf.department_id,
        EW.employee_id, EW.role_id
        FROM ESS_WORK_FLOW_MASTER AS wf
        INNER JOIN MASTER_DEPARTMENT AS dp ON dp.dept_id = wf.department_id
        INNER JOIN ESS_WORKFLOW_RANGE AS EW ON wf.id = EW.workflow_id
        INNER JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = EW.employee_id
        INNER JOIN HRMS_RBAC_ROLE_MASTER AS M ON M.role_master_id = EW.role_id
        WHERE EW.status = 'ACTIVE' 
        AND wf.id = ${workFlowData.id}`;

        const data = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT });

        if (data.length === 0) {
            return res.status(404).json({ code: 200, message: "Record Not Found", data: [] });
        }

        const roleFiled = data.map(item => ({
            role_id: item.role_id,
            employee_id: item.employee_id,
            level: item.level,
            first_name: item.first_name,
            last_name: item.last_name,
            role_master_name: item.role_master_name,
            status: item.status,
            isDeleted: item.isDeleted,
        }));

        const formattedData = {
            id: data[0].id,
            job_name: data[0].job_name,
            department_id: data[0].department_id,
            department_name: data[0].department_name,
            budget_planning_type: data[0].budget_planning_type,
            roleFiled: roleFiled
        };

        return res.status(200).json({
            code: 200,
            message: "Work Flow Details Fetched Successfully!",
            data: formattedData
        });

    } catch (error) {
        console.error("Error in view_workflow_byId:", error);
        return res.status(500).json({ code: 500, message: "Server Error" });
    }
};

exports.update_workflow_byId = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(403).send({ code: 403, message: "id not found" });
        }

        const { roleFiled, department_id, job_name, budget_planning_type, entity_id } = req.body;

        if (job_name === "Budget Planning") {

            if (budget_planning_type) {
                const existType = await db.WorkFlow_Master.findOne({
                    where: {
                        budget_planning_type,
                        job_name,
                        entity_id: entity_id,
                        department_id,
                        id: { [db.Sequelize.Op.ne]: id },
                        isDeleted: false
                    }
                });

                if (existType) {
                    return res.status(400).send({ code: 400, message: "Workflow Type already exists" });
                }
            }
        }

        const existingWorkflow = await db.WorkFlow_Master.findOne({ where: { id: id } });

        if (!existingWorkflow) {
            return res.status(404).send({ code: 404, message: "Workflow not found" });
        }

        await db.WorkFlow_Master.update(
            {
                department_id: department_id,
                budget_planning_type: budget_planning_type,
               
            },
            {
                where: { id: id }
            }
        );

        if (roleFiled && roleFiled.length > 0) {
            await db.WorkFlow_Map.update({ status: "INACTIVE", isDeleted: true }, { where: { workflow_id: id } });
            await db.Work_Flow_range.update({ status: "INACTIVE", isDeleted: true }, { where: { workflow_id: id } });

            const workflowMaps = roleFiled.map(role => ({
                workflow_id: id,
                role_id: role.role_id,
                employee_id: role.employee_id,
                status: "ACTIVE"
            }));

            const workflowRanges = roleFiled.map(role => ({
                workflow_id: id,
                role_id: role.role_id,
                employee_id: role.employee_id,
                level: role.level,
                status: "ACTIVE"
            }));

            await db.WorkFlow_Map.bulkCreate(workflowMaps, { updateOnDuplicate: ["role_id", "employee_id", "status"] });
            await db.Work_Flow_range.bulkCreate(workflowRanges, {
                updateOnDuplicate: ["role_id", "employee_id", "level", "status"]
            })
        }

        return res.status(200).send({
            code: 200,
            message: "Workflow updated successfully!",
        });
    } catch (error) {
        console.error("Error in update_workflow_byId:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.get_All_workflow = async (req, res) => {
    try {
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id);

        const query = `
        SELECT DISTINCT wf.id, dp.department_name, EW.level, wf.budget_planning_type,
        R.first_name, R.last_name, M.role_master_name, EW.status, wf.job_name, wf.department_id,
        EW.employee_id, EW.role_id
        FROM ESS_WORK_FLOW_MASTER AS wf
        INNER JOIN MASTER_DEPARTMENT AS dp ON dp.dept_id = wf.department_id
        INNER JOIN ESS_WORKFLOW_RANGE AS EW ON wf.id = EW.workflow_id
        INNER JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = EW.employee_id
        INNER JOIN HRMS_RBAC_ROLE_MASTER AS M ON M.role_master_id = EW.role_id
        WHERE EW.status = 'ACTIVE' 
        ${entity_id ? `AND wf.entity_id = ${entity_id}` : ''}
        ORDER BY wf.id DESC;`;

        const data = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT });

        if (data.length > 0) {
            const formattedData = [];
            const groupedData = new Map();
            data.forEach(item => {
                const key = `${item.id}-${item.department_name}`;
                if (!groupedData.has(key)) {
                    groupedData.set(key, {
                        id: item.id,
                        job_name: item.job_name,
                        budget_planning_type: item.budget_planning_type,
                        department_id: item.department_id,
                        department_name: item.department_name,
                        type: item.type,
                        roleField: []
                    });
                }
                groupedData.get(key).roleField.push({
                    role_id: item.role_id,
                    employee_id: item.employee_id,
                    level: item.level,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    role_master_name: item.role_master_name,
                    status: item.status,
                    isDeleted: item.isDeleted
                });
            });

            formattedData.push(...groupedData.values());

            return res.status(200).send({ code: 200, message: "Fetched Workflow Data Successfully!", data: formattedData });
        } else {
            return res.status(200).send({ code: 200, message: "Record Not Found", data: [] });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.get_All_workflow_type = async (req, res) => {
    try {
        const query = `
        SELECT DISTINCT W.type
        FROM ESS_WORK_FLOW_TYPE AS W `;

        const data = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT });
        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Workflow Data Successfully !", data: data });
        } else {
            return res.status(404).send({ code: 200, message: "Record Not Found", data: [] });
        }
    } catch (error) {
        console.error("Error in get_All_workflow:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
