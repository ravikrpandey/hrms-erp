const { log } = require("console");
const db = require("../../../models/index");
const { where } = require("sequelize");
const Department = db.department;
const { Op } = require("sequelize");

exports.createDepartment = async (req, res) => {
  try {
    const entity_id = req.query.entity_id;
    const { department_name, cc_code, role_master_id, employee_id } = req.body;
    const department_code = btoa(Math.random()).slice(0, 10).toUpperCase();

    const departmentdata = await Department.findOne({
      where: {
        department_name: department_name,
        entity_id: entity_id,
        isDeleted: false,
      },
    });
    if (departmentdata) {
      return res
        .status(404)
        .send({ code: 404, message: "Department Name is Already Exits!" });
    }
    const existCC = await Department.findOne({
      where: { entity_id: entity_id, cc_code: cc_code, isDeleted: false },
    });
    if (existCC) {
      return res
        .status(404)
        .send({ code: 404, message: "CC Code Already Exits!" });
    }

    const response = await Department.create({
      department_name: department_name,
      department_code: department_code,
      entity_id: entity_id,
      cc_code: cc_code,
      role_master_id: role_master_id,
      employee_id: employee_id,
    });
    return res
      .status(200)
      .send({
        code: 200,
        message: "Department Created Successfully",
        data: response,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllDepartment = async (req, res) => {
  try {
    let { entity_id } = req.query;
    entity_id = parseInt(entity_id);

    const getAllData = await Department.findAll({
      where: { entity_id, isDeleted: false },
      order: [["dept_id", "DESC"]],
    });
    if (getAllData.length > 0) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetch All Department Data Successfully",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllDepartment_all = async (req, res) => {
  try {
    // Extract and parse entity_id from query parameters
    let { entity_id } = req.query;
    entity_id = parseInt(entity_id, 10);

    // Check if entity_id is a valid number
    if (isNaN(entity_id)) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid entity_id provided" });
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
             AND D.entity_id = :entity_id;
           `,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { entity_id },
      }
    );

    // Check if data was returned from the query
    if (getAllData && getAllData.length > 0) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetch All Department Data Successfully",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "No data found" });
    }
  } catch (error) {
    console.error("Error fetching department data:", error);
    return res.status(500).send({ code: 500, message: "Server error" });
  }
};

exports.getByIdDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;

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
        replacements: { departmentId },
      }
    );

    if (getAllData.length > 0) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetch Department Data Successfully",
          data: getAllData[0],
        });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
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
          status,
        },
        { where: { dept_id: dept_id } }
      );
      return res
        .status(200)
        .send({
          code: 200,
          message: "Status Updated Successfully",
          data: updateData,
        });
    } else {
      return res.status(400).send({ code: 400, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getAllDepartment_pro = async (req, res) => {
  try {
    const Department_Details = await Department.findAll();
    let total_mvp = 0;
    for (let i = 0; i < Department_Details.length; i++) {
      let dept_name = Department_Details[i].department_name;
      const Precurement_Details = await Precurement_Details.findAll({
        where: { department: dept_name, po_status: "PAID" },
      });
      for (let i = 0; i < Precurement_Details.length; i++) {
        total_mvp += Precurement_Details[i].mvp;
      }
      let Remaining_Buget = Department_Details[i].budget_amount - total_mvp;
      let department_wise_po = total_mvp;
      let remaining_budget_amount = Remaining_Buget;
      if (Precurement_Details[i] == undefined) {
        const Update_Buget = await Department.update(
          { department_wise_po: 0, remaining_budget_amount: 0 },
          { where: { department_name: dept_name } }
        );
      } else {
        const Update_Buget = await Department.update(
          { department_wise_po, remaining_budget_amount },
          { where: { department_name: dept_name } }
        );
      }
    }
    if (Department_Details) {
      const Get_data = await Department.findAll();
      return res
        .status(200)
        .send({
          code: 200,
          message: "Budget Updated Successfully",
          data: Get_data,
        });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const dept_id = parseInt(req.params.dept_id);
    const dltStage = await Department.findOne({ where: { dept_id: dept_id } });
    if (dltStage) {
      const deleteData = await Department.update(
        { isDeleted: true },
        { where: { dept_id: dept_id } }
      );
      return res
        .status(200)
        .send({
          code: 200,
          message: "Data is Deleted Successfully!",
          data: deleteData,
        });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.editDepartment = async (req, res) => {
  try {
    const dept_id = req.params.dept_id;
    const { department_name, cc_code, role_master_id, employee_id } = req.body;
    const existingDept = await Department.findOne({
      where: {
        department_name: department_name,
        dept_id: {
          [Op.ne]: dept_id,
        },
      },
    });

    if (existingDept) {
      return res
        .status(400)
        .send({ code: 400, message: "Department name already exists!" });
    }
    if (dept_id) {
      await Department.update(
        {
          department_name,
          cc_code,
          role_master_id,
          employee_id,
        },
        {
          where: { dept_id: dept_id },
        }
      );
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found !" });
    }
    return res
      .status(200)
      .send({ code: 200, message: "Data is Updated Successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.calculate_Buget = async (req, res) => {
  try {
    const { department_name } = req.body;
    const Precurement_Details = await Procurement_productDetails.findAll({
      where: { department: department_name },
    });
    const Department_Details = await Department.findOne({
      where: { department_name: department_name },
    });
    let total_mvp = 0;
    for (let i = 0; i < Precurement_Details.length; i++) {
      total_mvp += Precurement_Details[i].mvp;
    }
    let Remaining_Buget = Department_Details.budget_amount - total_mvp;
    let department_wise_po = total_mvp;
    let remaining_budget_amount = Remaining_Buget;
    let obj = {
      department_wise_po: department_wise_po,
      remaining_budget_amount: remaining_budget_amount,
    };
    if (Department_Details) {
      const Update_Buget = await Department.update(
        { department_wise_po, remaining_budget_amount },
        { where: { department_name: department_name } }
      );
      res
        .status(200)
        .send({ code: 200, message: "Budget updated successfully", data: obj });
    } else {
      res.status(404).send({ code: 404, message: "Department not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.get_all_dep = async (req, res) => {
  try {
    const { dept_id } = req.params;
    const department = await db.department.findOne({
      where: { dept_id: dept_id },
      attributes: ["dept_id", "department_name"],
    });
    if (!department) {
      return res.status(404).send({
        code: 404,
        message: "Department not found",
      });
    }
    const areas = await db.area.findAll({
      where: { department_id: dept_id },
      attributes: ["id", "area_name"],
    });
    if (areas.length > 0) {
      return res.status(200).send({
        code: 200,
        message: `Found ${areas.length} Sub-Department for department: ${department.department_name}`,
        data: areas,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Sub-Department found for this department",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.depStatus = async (req, res) => {
  try {
    const dept_id = req.params.id;
    const { status } = req.body;
    const getData = await Department.findOne({
      where: {
        dept_id: dept_id,
        isDeleted: false,
      },
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
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/** get all depatment for workflow */
exports.getAllWorkflowDepartment = async (req, res) => {
  try {
    let { entity_id } = req.query;
    entity_id = parseInt(entity_id);

    const getAllData = await Department.findAll({
      where: { entity_id: entity_id, isDeleted: false },
      order: [["dept_id", "DESC"]],
    });

    if (getAllData.length > 0) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetched all department data successfully",
          data: getAllData,
        });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No departments found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// exports.createaMasterDepartment = async (req, res) => {
//   try {
//     const { department_name, cc_code, role_master_id, employee_id, entity_id } =
//       req.body;
//     if (!Array.isArray(entity_id) || entity_id.length === 0) {
//       return res
//         .status(400)
//         .send({ code: 400, message: "Entity ID must be a non-empty array" });
//     }
//     const createdDepartments = [];
//     for (const id of entity_id) {
//       const existingDept = await Department.findOne({
//         where: {
//           department_name: department_name,
//           entity_id: id,
//           isDeleted: false,
//         },
//       });
//       if (existingDept) {
//         continue;
//       }
//       const existingCC = await Department.findOne({
//         where: {
//           cc_code: cc_code,
//           entity_id: id,
//           isDeleted: false,
//         },
//       });
//       if (existingCC) {
//         continue;
//       }
//       const department_code = btoa(Math.random()).slice(0, 10).toUpperCase();
//       const newDepartment = await Department.create({
//         department_name: department_name,
//         department_code: department_code,
//         entity_id: id,
//         cc_code: cc_code,
//         role_master_id: role_master_id,
//         employee_id: employee_id,
//       });
//       createdDepartments.push(newDepartment);
//     }
//     if (createdDepartments.length === 0) {
//       return res.status(409).send({
//         code: 409,
//         message:
//           "No new departments created. All department names or CC codes already exist for the given entities.",
//       });
//     }
//     return res.status(200).send({
//       code: 200,
//       message: "Departments created successfully",
//       data: createdDepartments,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .send({ code: 500, message: error.message || "Server Error" });
//   }
// };


// exports.createaMasterDepartment = async (req, res) => {
//   try {
//     const entity_id = req.query.entity_id || req.body.entity_id; // fallback if sent in body
//     const {
//       department_name,
//       cc_code,
//       role_master_id,
//       employee_id,
//       bussiness_unit,
//       head_of_dept,
//       budget_allocation,
//       location,
//       is_parent_dept,
//       parent_dept,
//     } = req.body;

//     console.log("📥 Incoming Payload:", req.body);

//     // Generate unique department code
//     const department_code = btoa(Math.random()).slice(0, 10).toUpperCase();

//     // ✅ Check for duplicate department name
//     const existingDept = await Department.findOne({
//       where: {
//         department_name,
//         entity_id,
//         isDeleted: false,
//       },
//     });

//     if (existingDept) {
//       return res.status(400).send({
//         code: 400,
//         message: "Department Name is Already Exits!",
//       });
//     }

//     //  Check for duplicate CC code
//     const existingCC = await Department.findOne({
//       where: {
//         cc_code,
//         entity_id,
//         isDeleted: false,
//       },
//     });

//     if (existingCC) {
//       return res.status(400).send({
//         code: 400,
//         message: "CC Code Already Exits!",
//       });
//     }

//     // ✅ Create department
//     const newDepartment = await Department.create({
//       department_name,
//       department_code,
//       entity_id,
//       cc_code,
//       role_master_id,
//       employee_id,
//       bussiness_unit,
//       head_of_dept,
//       budget_allocation,
//       location,
//       is_parent_dept: is_parent_dept ? 1 : 0,
//       parent_dept: is_parent_dept ? null : parent_dept, // only store if applicable
//     });

//     console.log("✅ Department Created:", newDepartment);

//     return res.status(200).send({
//       code: 200,
//       message: "Department Created Successfully",
//       data: newDepartment,
//     });
//   } catch (error) {
//     console.error("❌ Error creating department:", error);
//     return res.status(500).send({
//       code: 500,
//       message: error.message || "Server Error",
//     });
//   }
// };

exports.createaMasterDepartment = async (req, res) => {
  try {
    let { entity_id } = req.body;

    // entity_id must be array
    if (!Array.isArray(entity_id) || entity_id.length === 0) {
      return res.status(400).send({
        code: 400,
        message: "entity_id must be a non-empty array",
      });
    }

    const {
      department_name,
      cc_code,
      role_master_id,
      employee_id,
      bussiness_unit,
      head_of_dept,
      budget_allocation,
      location,
      is_parent_dept,
      parent_dept,
    } = req.body;

    console.log("📥 Incoming Payload:", req.body);

    const createdDepartments = [];

    // LOOP through entity_id array
    for (const id of entity_id) {
      // Generate unique department code
      const department_code = btoa(Math.random()).slice(0, 10).toUpperCase();

      // 🔍 Check for duplicate department name
      const existingDept = await Department.findOne({
        where: {
          department_name,
          entity_id: id,
          isDeleted: false,
        },
      });

      if (existingDept) {
        return res.status(400).send({
          code: 400,
          message: `Department Name "${department_name}" already exists for entity ${id}!`,
        });
      }

      // 🔍 Check for duplicate CC code
      const existingCC = await Department.findOne({
        where: {
          cc_code,
          entity_id: id,
          isDeleted: false,
        },
      });

      if (existingCC) {
        return res.status(400).send({
          code: 400,
          message: `CC Code "${cc_code}" already exists for entity ${id}!`,
        });
      }

      // 🟢 CREATE department for each entity
      const newDepartment = await Department.create({
        department_name,
        department_code,
        entity_id: id, // IMPORTANT!
        cc_code,
        role_master_id,
        employee_id,
        bussiness_unit,
        head_of_dept,
        budget_allocation,
        location,
        is_parent_dept: is_parent_dept ? 1 : 0,
        parent_dept: is_parent_dept ? null : parent_dept,
      });

      createdDepartments.push(newDepartment);
    }

    return res.status(200).send({
      code: 200,
      message: "Department Created Successfully",
      data: createdDepartments,
    });

  } catch (error) {
    console.error("❌ Error creating department:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};


exports.editDepartmentMaster = async (req, res) => {
  try {
    let { entity_id } = req.body;

    if (!Array.isArray(entity_id) || entity_id.length === 0) {
      return res.status(400).send({
        code: 400,
        message: "entity_id must be a non-empty array",
      });
    }

    const {
      old_department_name,
      department_name,
      cc_code,
      role_master_id,
      employee_id,
      bussiness_unit,
      head_of_dept,
      budget_allocation,
      location,
      is_parent_dept,
      parent_dept,
    } = req.body;

    if (!old_department_name) {
      return res.status(400).send({
        code: 400,
        message: "old_department_name is required",
      });
    }

    const finalResult = [];

    // LOOP for each entity
    for (const id of entity_id) {
      // 🔎 Check duplicate Department Name
      const checkDeptName = await Department.findOne({
        where: {
          department_name,
          entity_id: id,
          isDeleted: false,
          dept_id: { [Op.ne]: req.body.dept_id } // avoid conflict with itself
        },
      });

      if (checkDeptName) {
        return res.status(400).send({
          code: 400,
          message: `Department Name "${department_name}" already exists for entity ${id}`,
        });
      }

      // 🔎 Check duplicate CC code
      const checkCC = await Department.findOne({
        where: {
          cc_code,
          entity_id: id,
          isDeleted: false,
          department_name: { [Op.ne]: old_department_name }
        },
      });

      if (checkCC) {
        return res.status(400).send({
          code: 400,
          message: `CC Code "${cc_code}" already exists for entity ${id}`,
        });
      }

      // 🔍 Check if department exists for this entity
      const deptExists = await Department.findOne({
        where: {
          department_name: old_department_name,
          entity_id: id,
          isDeleted: false,
        },
      });

      if (deptExists) {
        // 🟢 UPDATE
        await Department.update(
          {
            department_name,
            cc_code,
            role_master_id,
            employee_id,
            bussiness_unit,
            head_of_dept,
            budget_allocation,
            location,
            is_parent_dept: is_parent_dept ? 1 : 0,
            parent_dept: is_parent_dept ? null : parent_dept,
            updatedAt: new Date(),
          },
          {
            where: {
              department_name: old_department_name,
              entity_id: id,
              isDeleted: false,
            },
          }
        );

        finalResult.push({ entity_id: id, action: "updated" });
      } else {
        // 🟢 CREATE NEW (if not exists)
        const department_code = btoa(Math.random()).slice(0, 10).toUpperCase();

        const newDept = await Department.create({
          department_name,
          department_code,
          entity_id: id,
          cc_code,
          role_master_id,
          employee_id,
          bussiness_unit,
          head_of_dept,
          budget_allocation,
          location,
          is_parent_dept: is_parent_dept ? 1 : 0,
          parent_dept: is_parent_dept ? null : parent_dept,
        });

        finalResult.push({ entity_id: id, action: "created", data: newDept });
      }
    }

    return res.status(200).send({
      code: 200,
      message: "Department updated/created successfully",
      data: finalResult,
    });

  } catch (error) {
    console.error("❌ Error updating department:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};



// exports.editDepartmentMaster = async (req, res) => {
//   try {
//     const {
//       department_name,
//       old_department_name,
//       cc_code,
//       role_master_id,
//       employee_id,
//       entity_id,
//     } = req.body;

//     if (!Array.isArray(entity_id) || entity_id.length === 0) {
//       return res.status(400).send({
//         code: 400,
//         message: "Entity ID must be a non-empty array",
//       });
//     }

//     if (!old_department_name || !department_name) {
//       return res.status(400).send({
//         code: 400,
//         message: "Both old and new department names are required",
//       });
//     }

//     const updatedDepartments = [];

//     for (const id of entity_id) {
//       const departments = await Department.findAll({
//         where: {
//           department_name: old_department_name,
//           entity_id: id,
//           isDeleted: false,
//         },
//       });

//       if (departments.length > 0) {
//         await Department.update(
//           {
//             department_name,
//             cc_code,
//             role_master_id,
//             employee_id,
//             updatedAt: new Date(),
//           },
//           {
//             where: {
//               department_name: old_department_name,
//               entity_id: id,
//               isDeleted: false,
//             },
//           }
//         );

//         updatedDepartments.push(...departments);
//       } else {
//         const department_code = btoa(Math.random()).slice(0, 10).toUpperCase();
//         const newDepartment = await Department.create({
//           department_name,
//           department_code,
//           entity_id: id,
//           cc_code,
//           role_master_id,
//           employee_id,
//         });
//         updatedDepartments.push(newDepartment);
//       }
//     }

//     return res.status(200).send({
//       code: 200,
//       message: "Departments updated/inserted successfully",
//       data: updatedDepartments,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({
//       code: 500,
//       message: error.message || "Server Error",
//     });
//   }
// };

//   exports.editDepartmentMaster = async (req, res) => {
//     try {
//       const dept_id = req.params.dept_id;
//       const {
//         department_name,
//         cc_code,
//         role_master_id,
//         employee_id,
//         entity_id
//       } = req.body;

//       if (!Array.isArray(entity_id) || entity_id.length === 0) {
//         return res.status(400).send({
//           code: 400,
//           message: "Entity ID must be a non-empty array"
//         });
//       }

//       const upsertedDepartments = [];

//       for (const id of entity_id) {
//         const existingDept = await Department.findOne({
//           where: {
//             department_name: department_name,
//             entity_id: id,
//             isDeleted: false
//           }
//         });

//         if (existingDept) {
//           await existingDept.update({
//             cc_code,
//             role_master_id,
//             employee_id
//           });
//           upsertedDepartments.push(existingDept);
//         } else {
//           const department_code = btoa(Math.random()).slice(0, 10).toUpperCase();
//           const newDepartment = await Department.create({
//             department_name,
//             department_code,
//             entity_id: id,
//             cc_code,
//             role_master_id,
//             employee_id
//           });
//           upsertedDepartments.push(newDepartment);
//         }
//       }

//       return res.status(200).send({
//         code: 200,
//         message: "Departments inserted/updated successfully",
//         data: upsertedDepartments
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).send({
//         code: 500,
//         message: error.message || "Server Error"
//       });
//     }
//   };

// exports.getByIdDepartmentMater = async (req, res) => {
//   try {
//     const departmentName = req.params.department_name;
//     const departmentData = await db.sequelize.query(
//       `
//         SELECT 
//           D.department_name,
//           D.cc_code,
//           D.department_code,
//           D.status,
//           D.entity_id,
//           D.role_master_id,
//           D.employee_id,
//           U.first_name, 
//           U.last_name, 
//           R.role_master_name 
//         FROM MASTER_DEPARTMENT AS D
//         LEFT JOIN HRMS_REGISTERED_USER AS U 
//           ON D.employee_id = U.employee_id
//         LEFT JOIN HRMS_RBAC_ROLE_MASTER AS R 
//           ON D.role_master_id = R.role_master_id
//         WHERE D.isDeleted = 0 AND D.department_name = :departmentName
//         `,
//       {
//         type: db.sequelize.QueryTypes.SELECT,
//         replacements: { departmentName },
//       }
//     );

//     if (departmentData.length > 0) {
//       const entityIds = departmentData.map((item) => item.entity_id);
//       const filteredData = [
//         {
//           department_name: departmentData[0].department_name,
//           cc_code: departmentData[0].cc_code,
//           department_code: departmentData[0].department_code,
//           status: departmentData[0].status,
//           role_master_id: departmentData[0].role_master_id,
//           employee_id: departmentData[0].employee_id,
//           first_name: departmentData[0].first_name,
//           last_name: departmentData[0].last_name,
//           role_master_name: departmentData[0].role_master_name,
//         },
//       ];
//       return res.status(200).send({
//         code: 200,
//         message: "Department data fetched successfully",
//         data: filteredData,
//         entity_ids: entityIds,
//       });
//     } else {
//       return res.status(404).send({ code: 404, message: "No records found" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ code: 500, message: "Server Error" });
//   }
// };

exports.getByIdDepartmentMater = async (req, res) => {
  try {
    const departmentName = req.params.department_name;

    const rows = await db.sequelize.query(
      `
      SELECT 
        D.dept_id,
        D.department_name,
        D.cc_code,
        D.department_code,
        D.status,
        D.entity_id,
        D.role_master_id,
        D.employee_id,
        D.budget_allocation,
        D.is_parent_dept,
        D.parent_dept,
        D.bussiness_unit,
        D.head_of_dept,
        D.location,

        U.first_name AS employee_first_name,
        U.last_name AS employee_last_name,

        R.role_master_name,
        BU.businessunit_name,
        PD.department_name AS parent_dept_name,
        B.branch_name AS location_name

      FROM MASTER_DEPARTMENT AS D
      LEFT JOIN HRMS_REGISTERED_USER AS U 
        ON D.employee_id = U.employee_id
      LEFT JOIN HRMS_RBAC_ROLE_MASTER AS R 
        ON D.role_master_id = R.role_master_id
      LEFT JOIN BUSINESS_UNIT_MASTER AS BU
        ON D.bussiness_unit = BU.business_unit_id
      LEFT JOIN MASTER_BRANCH AS B 
        ON D.location = B.id
      LEFT JOIN MASTER_DEPARTMENT AS PD 
        ON D.parent_dept = PD.dept_id

      WHERE D.isDeleted = 0 
      AND D.department_name = :departmentName;
      `,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { departmentName },
      }
    );

    if (rows.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No records found",
      });
    }

    // ⭐⭐⭐ MERGE ALL ROWS
    const main = { ...rows[0] };
    main.entity_id = rows.map(r => Number(r.entity_id)); // → [2,3]

    return res.status(200).send({
      code: 200,
      message: "Department data fetched successfully",
      data: main,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: "Server Error",
      error,
    });
  }
};


// exports.getByIdDepartmentMater = async (req, res) => {
//   try {
//     const departmentName = req.params.department_name;

//     const departmentData = await db.sequelize.query(
//       `
//           SELECT 
//   D.dept_id,
//   D.department_name,
//   D.cc_code,
//   D.department_code,
//   D.status,
//   D.entity_id,
//   D.role_master_id,
//   D.employee_id,
//   D.budget_allocation,
//   D.is_parent_dept,
//   D.parent_dept,
//   D.bussiness_unit,
//   D.head_of_dept,
//   D.location,

//   U.first_name AS employee_first_name,
//   U.last_name AS employee_last_name,

//   R.role_master_name,

//   BU.businessunit_name,

//   PD.department_name AS parent_dept_name,

//   B.branch_name AS location_name

// FROM MASTER_DEPARTMENT AS D
// LEFT JOIN HRMS_REGISTERED_USER AS U 
//   ON D.employee_id = U.employee_id
// LEFT JOIN HRMS_RBAC_ROLE_MASTER AS R 
//   ON D.role_master_id = R.role_master_id
// LEFT JOIN BUSINESS_UNIT_MASTER AS BU
//   ON D.bussiness_unit = BU.business_unit_id
// LEFT JOIN MASTER_BRANCH AS B 
//   ON D.location = B.id
// LEFT JOIN MASTER_DEPARTMENT AS PD 
//   ON D.parent_dept = PD.dept_id

// WHERE D.isDeleted = 0 
// AND D.department_name = :departmentName;


//       `,
//       {
//         type: db.sequelize.QueryTypes.SELECT,
//         replacements: { departmentName },
//       }
//     );

//     if (departmentData.length > 0) {
//       return res.status(200).send({
//         code: 200,
//         message: "Department data fetched successfully",
//         data: departmentData[0],
//       });
//     }

//     return res
//       .status(404)
//       .send({ code: 404, message: "No records found" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ code: 500, message: "Server Error", error });
//   }
// };

