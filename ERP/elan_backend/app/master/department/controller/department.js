const { log } = require("console");
const db = require("../../../models/index");
const { where } = require("sequelize");
const Department = db.department;
const logger = require('../../../../logger/index');

const fs = require('fs');
const csv = require('csv-parser');


exports.createDepartment_csv = async (req, res) => {
  try {
    const { entity_id,  } = req.body;  


    if (!entity_id ) {
      return res.status(400).send({ code: 400, message: 'Entity ID are required' });
    }

    if (!req.file) {
      return res.status(400).send({ code: 400, message: 'No file uploaded' });
    }


    if (req.file.mimetype !== "text/csv") {
      return res.status(400).send({ code: 400, message: 'Only CSV files are allowed' });
    }

    const csvData = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => csvData.push(data))
      .on('end', async () => {
 
        for (const row of csvData) {
          const { department_name, cc_code,  } = row;


          if (!department_name || !cc_code ) {
            return res.status(400).send({ code: 400, message: 'Missing required fields in the CSV' });
          }

  
          const departmentExists = await Department.findOne({
            where: { department_name, entity_id, isDeleted: false },
          });
          if (departmentExists) {
            return res.status(400).send({ code: 400, message: `Department ${department_name} Already Exists!` });
          }

   
          const ccCodeExists = await Department.findOne({
            where: { cc_code, entity_id, isDeleted: false },
          });
          if (ccCodeExists) {
            return res.status(400).send({ code: 400, message: `CC Code ${cc_code} Already Exists!` });
          }

          const department_code = btoa(Math.random().toString()).slice(0, 10).toUpperCase();

    
          await Department.create({
            department_name:department_name, 
            department_code:department_code, 
            entity_id:entity_id, 
            cc_code:cc_code, 
    
          
          });
        }

       
        return res.status(200).send({ code: 200, message: 'Departments Created Successfully' });
      });
  } catch (error) {
    console.error(`Error: ${error.message}`, { error });
    return res.status(500).send({ code: 500, message: error.message || 'Server Error' });
  }
};


exports.createDepartment = async (req, res) => {
    try {
        const entity_id = req.query.entity_id;
        const { department_name, cc_code, role_master_id, employee_id, financial_year_id } = req.body;
        const department_code = btoa(Math.random()).slice(0, 10).toUpperCase();

        const departmentdata = await Department.findOne(
            { where: { department_name: department_name, entity_id: entity_id, isDeleted: false } }
        );
        if (departmentdata) {
            return res.status(404).send({ code: 404, message: "Department Name is Already Exits!" });
        }
        const existCC = await Department.findOne(
            { where: { entity_id: entity_id, cc_code: cc_code, isDeleted: false } }
        );
        if (existCC) {
            return res.status(404).send({ code: 404, message: "CC Code Already Exits!" });
        }

        const response = await Department.create({
            department_name: department_name, department_code: department_code, entity_id: entity_id, cc_code: cc_code, role_master_id: role_master_id, employee_id: employee_id,
            financial_year_id: financial_year_id
        });
        return res.status(200).send({ code: 200, message: "Department Created Successfully", data: response })
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAllDepartment = async (req, res) => {
    try {

        let { entity_id } = req.query;
        entity_id = parseInt(entity_id)


        const getAllData = await db.department.findAll({
            where: { entity_id, isDeleted: false, },
            order: [['dept_id', 'DESC']]
        })
        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All Department Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllDepartment_active = async (req, res) => {
    try {

        let { entity_id } = req.query;
        entity_id = parseInt(entity_id)


        const getAllData = await db.department.findAll({
            where: { entity_id, isDeleted: false, status: 'ACTIVE' },
            order: [['dept_id', 'DESC']]
        })
        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All Department Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};





exports.getAllDepartment_all = async (req, res) => {
    try {
        // Extract and parse entity_id from query parameters
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id, 10);

        // Check if entity_id is a valid number
        if (isNaN(entity_id)) {
            return res.status(400).send({ code: 400, message: "Invalid entity_id provided" });
        }

        // Execute the SQL query with entity_id as a replacement
        const getAllData = await db.sequelize.query(
            `   SELECT D.*, 
             U.first_name, 
             U.last_name, 
             R.role_master_name 
             FROM MASTER_DEPARTMENT AS D
             LEFT JOIN HRMS_REGISTERED_USER AS U 
             ON U.employee_id = D.employee_id
             LEFT JOIN HRMS_RBAC_ROLE_MASTER AS R 
             ON R.role_master_id = D.role_master_id
             WHERE D.isDeleted = 0 
             AND (U.status = 'ACTIVE' OR U.employee_id IS NULL)
             AND (R.status = 'ACTIVE' OR R.role_master_id IS NULL)
             AND D.entity_id = :entity_id
             ORDER BY D.dept_id DESC
           `,
            {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: { entity_id }
            }
        );

        // Check if data was returned from the query
        if (getAllData && getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All Department Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "No data found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error('Error fetching department data:', error);
        return res.status(500).send({ code: 500, message: "Server error" });
    }
};


exports.getByIdDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id

        const getAllData = await db.sequelize.query(
            `   SELECT 
                D.department_name,
                D.cc_code,
                D.department_code,
                D.status,
                D.role_master_id,
                D.employee_id,
                U.first_name, 
                U.last_name, 
                R.role_master_name 
                FROM MASTER_DEPARTMENT AS D
                LEFT JOIN HRMS_REGISTERED_USER AS U 
                ON D.employee_id = U.employee_id
                LEFT JOIN HRMS_RBAC_ROLE_MASTER AS R 
                ON D.role_master_id = R.role_master_id
                WHERE D.isDeleted = 0 AND D.dept_id = ${departmentId}
              `,
            {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: { departmentId }
            }
        );

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch Department Data Successfully", data: getAllData[0] });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};



exports.updateDepartmentStatus = async (req, res) => {
    try {
        const dept_id = req.params.departmentId;
        const { status } = req.body;
        const editData = await Department.findOne({ where: { dept_id: dept_id } });
        if (editData) {
            const updateData = await Department.update(
                {
                    status
                }, { where: { dept_id: dept_id } }
            );
            return res.status(200).send({ code: 200, message: "Status Updated Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.getAllDepartment_pro = async (req, res) => {
    try {
        const Department_Details = await Department.findAll()
        let total_mvp = 0;
        for (let i = 0; i < Department_Details.length; i++) {
            let dept_name = Department_Details[i].department_name;
            const Precurement_Details = await Precurement_Details.findAll({ where: { department: dept_name, po_status: "PAID" } });
            for (let i = 0; i < Precurement_Details.length; i++) {
                total_mvp += Precurement_Details[i].mvp;
            }
            let Remaining_Buget = Department_Details[i].budget_amount - total_mvp;
            let department_wise_po = total_mvp;
            let remaining_budget_amount = Remaining_Buget;
            if (Precurement_Details[i] == undefined) {
                const Update_Buget = await Department.update({ department_wise_po: 0, remaining_budget_amount: 0 }, { where: { department_name: dept_name } })
            } else {
                const Update_Buget = await Department.update({ department_wise_po, remaining_budget_amount }, { where: { department_name: dept_name } })
            }
        }
        if (Department_Details) {
            const Get_data = await Department.findAll()
            return res.status(200).send({ code: 200, message: "Budget Updated Successfully", data: Get_data });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.deleteDepartment = async (req, res) => {
    try {
        const dept_id = parseInt(req.params.dept_id);
        const dltStage = await Department.findOne({ where: { dept_id: dept_id } });
        if (dltStage) {
            const deleteData = await Department.update({ isDeleted: true }, { where: { dept_id: dept_id } });
            return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.editDepartment = async (req, res) => {
    try {
        const dept_id = req.params.dept_id;
        const { department_name, cc_code, role_master_id, employee_id } = req.body;

        if (dept_id) {
            const update_department = await Department.update({
                department_name, cc_code, role_master_id, employee_id
            },
                {
                    where: { dept_id: dept_id }
                })
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found !" });
        }
        return res.status(200).send({ code: 200, message: "Data is Updated Successfully!" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.calculate_Buget = async (req, res) => {
    try {
        const { department_name } = req.body;
        const Precurement_Details = await Procurement_productDetails.findAll({ where: { department: department_name } });
        const Department_Details = await Department.findOne({ where: { department_name: department_name } })
        let total_mvp = 0;
        for (let i = 0; i < Precurement_Details.length; i++) {
            total_mvp += Precurement_Details[i].mvp;
        }
        let Remaining_Buget = Department_Details.budget_amount - total_mvp;
        let department_wise_po = total_mvp;
        let remaining_budget_amount = Remaining_Buget;
        let obj = {
            "department_wise_po": department_wise_po,
            "remaining_budget_amount": remaining_budget_amount
        }
        if (Department_Details) {
            const Update_Buget = await Department.update({ department_wise_po, remaining_budget_amount }, { where: { department_name: department_name } })
            res.status(200).send({ code: 200, message: "Budget updated successfully", data: obj })
        } else {
            res.status(404).send({ code: 404, message: "Department not found" })
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

exports.get_all_dep = async (req, res) => {
    try {
        const { dept_id } = req.params;
        const department = await db.department.findOne({
            where: { dept_id: dept_id },
            attributes: ['dept_id', 'department_name']
        });
        if (!department) {
            return res.status(404).send({
                code: 404,
                message: "Department not found"
            });
        }
        const areas = await db.area.findAll({
            where: { dept_id: dept_id },
            attributes: ['id', 'area_name']
        });
        if (areas.length > 0) {
            return res.status(200).send({
                code: 200,
                message: `Found ${areas.length} areas for department: ${department.department_name}`,
                data: areas
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No areas found for this department"
            });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

exports.depStatus = async (req, res) => {
    try {
        const dept_id = req.params.id;
        const { status } = req.body;
        const getData = await Department.findOne({
            where: {
                dept_id: dept_id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await Department.update(
                { status },
                { where: { dept_id: dept_id } }
            );
            return res.status(200).send({
                code: 200,
                message: " Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

/** get all depatment for workflow */
exports.getAllWorkflowDepartment = async (req, res) => {
    try {
        let { employee_id } = req.query;
        employee_id = parseInt(employee_id);

        const entities = await db.user_entity.findAll({ where: { employee_id: employee_id } });

        if (entities.length === 0) {
            return res.status(404).send({ code: 404, message: "No entities found for the given employee_id" });
        }

        const entityIds = entities.map(entity => entity.entity_id);

        const getAllData = await Department.findAll({
            where: { entity_id: entityIds, isDeleted: false },
            order: [['dept_id', 'DESC']]
        });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched all department data successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "No departments found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};