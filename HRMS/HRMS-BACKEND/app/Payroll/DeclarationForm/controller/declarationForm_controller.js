const { where } = require("sequelize");
const db = require("../../../models/index");
const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const { EmployeeDeclaration } = require("../../../models/index");
const HouseOnRent = db.HouseOnRent
const HouseProperty = db.housePropertyDeclaration;


/////////////// Create Declaration Form ///////////////

exports.createDeclarationForm = async (req, res) => {
    try {
        const { entity_id, login_id, saving_amout,declaration_form, financial_year_id } = req.body;
        let isExistYear = await db.payroll_declaration_form.findOne({where: {financial_year_id : financial_year_id, login_id: login_id,isDeleted: false}})
        if(isExistYear){
            return res.status(400).send({code: 400, message: "Form already Exist in this year!"})
        }
        const getApprover = await db.user.findOne({
            where: {
                employee_id: login_id
            },
            attributes: ["reporting_manager_id"]
        })
       
        const response = await db.payroll_declaration_form.create({
            declaration_form,
            financial_year_id,
            login_id,
            entity_id,
            saving_amout,
            declaration_form: declaration_form,
            approver: getApprover.reporting_manager_id
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
                pd.*, mf.financial_year,  em.entity_name, em.company_branch,
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
        const {approver} = req.params
        // Start building the query
        let query = `
            SELECT 
                pd.*, mf.financial_year,  em.entity_name, em.company_branch,
                CONCAT(ru.first_name, ' ', ru.last_name) AS employee_name, ru.employee_code
            FROM PAYROLL_DECLARATION_FORM pd
            INNER JOIN MASTER_FINANCIAL_YEAR mf ON pd.financial_year_id = mf.id
            INNER JOIN HRMS_REGISTERED_USER ru ON pd.login_id = ru.employee_id
            LEFT JOIN ENTITY_MASTER em ON pd.entity_id = em.id
            WHERE pd.isDeleted = false AND pd.approval_status= 'APPROVED' AND pd.approver =:approver
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
            replacements: {approver},
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

        const {approver} = req.params; 

        // Start building the query
        let query = `
            SELECT 
                pd.*, mf.financial_year,  em.entity_name, em.company_branch,
                CONCAT(ru.first_name, ' ', ru.last_name) AS employee_name, ru.employee_code
            FROM PAYROLL_DECLARATION_FORM pd
            INNER JOIN MASTER_FINANCIAL_YEAR mf ON pd.financial_year_id = mf.id
            INNER JOIN HRMS_REGISTERED_USER ru ON pd.login_id = ru.employee_id
            LEFT JOIN ENTITY_MASTER em ON pd.entity_id = em.id
            WHERE pd.isDeleted = false AND pd.approval_status= 'PENDING' AND pd.approver =:approver
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
            replacements: {approver},
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
        const {approver} = req.params
        // Start building the query
        let query = `
            SELECT 
                pd.*, mf.financial_year,  em.entity_name, em.company_branch,
                CONCAT(ru.first_name, ' ', ru.last_name) AS employee_name, ru.employee_code
            FROM PAYROLL_DECLARATION_FORM pd
            INNER JOIN MASTER_FINANCIAL_YEAR mf ON pd.financial_year_id = mf.id
            INNER JOIN HRMS_REGISTERED_USER ru ON pd.login_id = ru.employee_id
            LEFT JOIN ENTITY_MASTER em ON pd.entity_id = em.id
            WHERE pd.isDeleted = false AND pd.approval_status= 'REJECTED' AND pd.approver =:approver
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
            replacements: {approver},
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


module.exports.getAllDeclarationType = async (req, res) => {
  try {
    const data = await db.declaration_type.findAll({
      where: { isDeleted: false, status: 'ACTIVE' }
    });

    if (!data || data.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "Data not found"
      });
    }

    return res.status(200).json({
      code: 200,
      message: "All data fetched successfully",
      data
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error"
    });
  }
};




exports.createOrUpdateDeclarations = async (req, res) => {
  const t = await EmployeeDeclaration.sequelize.transaction();

  try {
    const { employee_id, data } = req.body;

    if (!employee_id || !data) {
      return res.status(400).json({ code: 400, message: "employee_id and data are required" });
    }

  
    const parsedData = JSON.parse(data);

    
    const filesMap = {};
    (req.files || []).forEach(file => {
      filesMap[file.fieldname] = file.path; 
    });

    for (const sectionObj of parsedData) {
      const section = sectionObj.section;
      const items = sectionObj.items;

     
      if (section === "Section 80C, 80CCC, 80CCD") {
        const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
        const maxLimit = parseFloat(items[0]?.maxLimit) || 0;
        if (total > maxLimit) {
          await t.rollback();
          return res.status(400).json({
            code: 400,
            message: `Total amount for ${section} exceeds Max Limit of ${maxLimit}`,
          });
        }
      } else {
       
        for (const item of items) {
          const amount = parseFloat(item.amount) || 0;
          const maxLimit = parseFloat(item.maxLimit) || 0;
          if (amount > maxLimit) {
            await t.rollback();
            return res.status(400).json({
              code: 400,
              message: `Amount for "${item.declaration_type.trim()}" exceeds Max Limit of ${maxLimit}`,
            });
          }
        }
      }

     
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

       
        const fileKey = `data[${section}][items][${i}][document]`;
        const documentPath = filesMap[fileKey] || item.document || null;

        const existing = await EmployeeDeclaration.findOne({
          where: {
            employee_id,
            section,
            declaration_type: item.declaration_type.trim(),
          },
          transaction: t,
        });

        const payload = {
          employee_id,
          section,
          declaration_type: item.declaration_type.trim(),
          age: item.age,
          maxLimit: parseFloat(item.maxLimit) || 0,
          amount: parseFloat(item.amount) || 0,
          document: documentPath,
          status: item.status || "ACTIVE",
          isDeleted: item.isDeleted || false,
        };

        if (existing) {
          await existing.update(payload, { transaction: t });
        } else {
          await EmployeeDeclaration.create(payload, { transaction: t });
        }
      }
    }

    await t.commit();
    res.json({ code: 200, message: "Declarations saved successfully" });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ code: 500, message: err.message || "Error saving declarations" });
  }
};


exports.getAllDeductionChapter = async (req, res) => {
  const { employee_id } = req.params; 

  try {
    const declarations = await EmployeeDeclaration.findAll({
      where: { employee_id, isDeleted: false },
      order: [['id', 'ASC']]
    });

    
    if (!declarations || declarations.length === 0) {
      return res.status(404).json({
        code: 404,
        message: 'No Declarations found for this employee',
        data: []
      });
    }

    
    const groupedData = declarations.reduce((acc, item) => {
      const section = item.section || 'Unknown Section';
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    }, {});

    res.status(200).json({
      code: 200,
      message: 'All Declarations fetched successfully',
      data: groupedData
    });

  } catch (err) {
    console.error('Error fetching declarations:', err);
    res.status(500).json({
      code: 500,
      message: err.message || 'Internal Server Error'
    });
  }
};




// module.exports.createOrUpdateHouses = async (req, res) => {
//   try {
//     const { houses, employee_id } = req.body;

//     console.log('Request Body:', req.body);

//     if (!employee_id || !houses || !Array.isArray(houses) || houses.length === 0) {
//       return res.status(400).json({
//         code: 400,
//         message: "Invalid payload: 'houses' array and 'employee_id' are required!"
//       });
//     }

//     const results = [];

//     for (let houseData of houses) {

//       houseData.employee_id = employee_id;

//       if (houseData.id) {
    
//         const house = await HouseOnRent.findByPk(houseData.id);
//         if (house) {
//           await house.update(houseData);
//           results.push({ action: 'updated', data: house });
//         } else {
//           results.push({ action: 'skipped', message: `House with id ${houseData.id} not found` });
//         }
//       } else {
       
//         const newHouse = await HouseOnRent.create(houseData);
//         results.push({ action: 'created', data: newHouse });
//       }
//     }

//     return res.status(200).json({code: 200,message: "Houses processed successfully!",data:results});

//   } catch (err) {
//     return res.status(500).json({ code: 500, message: "Server error!", error: err.message});
// }
// };

module.exports.createOrUpdateHouses = async (req, res) => {
  try {
    let { houses, employee_id } = req.body;

    // FormData sends arrays as strings, so parse it
    if (typeof houses === 'string') {
      try {
        houses = JSON.parse(houses);
      } catch (err) {
        return res.status(400).json({ code: 400, message: "Invalid 'houses' JSON!" });
      }
    }

    if (!employee_id || !houses || !Array.isArray(houses) || houses.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Invalid payload: 'houses' array and 'employee_id' are required!"
      });
    }

    const results = [];

    for (let houseData of houses) {
      houseData.employee_id = employee_id;

      if (houseData.id) {
        const house = await HouseOnRent.findByPk(houseData.id);
        if (house) {
          await house.update(houseData);
          results.push({ action: 'updated', data: house });
        } else {
          results.push({ action: 'skipped', message: `House with id ${houseData.id} not found` });
        }
      } else {
        const newHouse = await HouseOnRent.create(houseData);
        results.push({ action: 'created', data: newHouse });
      }
    }

    return res.status(200).json({ code: 200, message: "Houses processed successfully!", data: results });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: 500, message: "Server error!", error: err.message });
  }
};

module.exports.getHousesOnRent = async (req, res) => {
  try {
    const { employee_id } = req.params;

    const results = await HouseOnRent.findAll({
      where: {
        employee_id,         
        isDeleted: false,
        status: 'ACTIVE'
      },
      order: [['id', 'ASC']]
    });

    if (!results || results.length === 0) {
      return res.status(404).send({
        code: 404,
        message: 'No house rent data found for this employee!'
      });
    }

    return res.status(200).send({
      code: 200,
      message: 'House rent data fetched successfully!',
      data: results
    });
  } catch (error) {
    console.error('Error fetching house rent data:', error);
    return res.status(500).send({
      code: 500,
      message: error.message || 'Internal server error!'
    });
  }
};




exports.createHouseProperty = async (req, res) => {
  try {
    const {
      id, 
      employee_id,
      selfOccupiedProperty,
      letOutProperties,
      summaryTable,
      otherIncome,
      tcsTdsDeductions,
      remarks
    } = req.body;

    let data;

    if (id) {
      
      const [updatedRows] = await HouseProperty.update(
        {
          employee_id,
          self_occupied_property: selfOccupiedProperty,
          let_out_properties: letOutProperties,
          summary_table: summaryTable,
          other_income: otherIncome,
          tcs_tds_deductions: tcsTdsDeductions,
          remarks
        },
        { where: { id } }
      );

      if (!updatedRows) {
        return res.status(404).send({
          success: false,
          message: "House property record not found for update!"
        });
      }

     
      data = await HouseProperty.findOne({ where: { id } });

      return res.status(200).send({
        success: true,
        message: "House property updated successfully!",
        data
      });

    } else {
     
      data = await HouseProperty.create({
        employee_id,
        self_occupied_property: selfOccupiedProperty,
        let_out_properties: letOutProperties,
        summary_table: summaryTable,
        other_income: otherIncome,
        tcs_tds_deductions: tcsTdsDeductions,
        remarks
      });

      return res.status(201).send({
        success: true,
        message: "House property created successfully!",
        data
      });
    }

  } catch (error) {
    console.error("Error creating/updating house property:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error!",
      error: error.message
    });
  }
};



exports.getAllHouseProperties = async (req, res) => {
  try {
    const { employee_id } = req.params; 

    const data = await HouseProperty.findAll({
      where: {
        employee_id,        
        isDeleted: false
      },
      order: [['id', 'ASC']]
    });

    if (!data || data.length === 0) {
      return res.status(404).send({
        success: false,
        code: 404,
        message: "No house property records found for this employee!"
      });
    }

    res.status(200).send({
      success: true,
      code: 200,
      message: "House property records fetched successfully!",
      data
    });
  } catch (error) {
    console.error('Error fetching house property records:', error);
    res.status(500).send({
      success: false,
      code: 500,
      message: "Error fetching records",
      error: error.message
    });
  }
};



// module.exports.getAllSectionTotal = async (req, res) => {
//   try {
//     const [result] = await db.query(`
//       SELECT 
//         SUM(total_amount) AS grand_total
//       FROM (
//         SELECT SUM(ED.amount) AS total_amount
//         FROM EMPLOYEE_DECLARATION AS ED
//         WHERE ED.amount > 0

//         UNION ALL

//         SELECT SUM(HR.annualRate) AS total_amount
//         FROM HOUSE_ON_RENT AS HR
//       ) AS combined;
//     `);
//     res.status(200).json({code:200, message: "Total sum of EMPLOYEE_DECLARATION.amount and HOUSE_ON_RENT.annualRate",
//       data: result[0]
//     });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({
//       code:500,
//       message: "Error fetching total sum",
//       error: error.message
//     });
//   }
// };

module.exports.getAllSectionTotal = async (req, res) => {
  try {
    const { employee_id } = req.params;

    if (!employee_id) {
      return res.status(400).json({
        code: 400,
        message: "employee_id is required in params",
      });
    }

    const result = await db.sequelize.query(
      `
      -- Individual rows with their own document
      SELECT declaration_type, total_amount, document
      FROM (
          -- EMPLOYEE_DECLARATION rows
          SELECT 
              ED.declaration_type,
              ED.amount AS total_amount,
              ED.document
          FROM EMPLOYEE_DECLARATION AS ED
          WHERE ED.amount > 0 AND ED.employee_id = :empId

          UNION ALL

          -- HOUSE_ON_RENT rows with numbering
          SELECT 
              CONCAT('HOUSE_ON_RENT ', ROW_NUMBER() OVER (ORDER BY HR.id)) AS declaration_type,
              HR.annualRate AS total_amount,
              HR.document
          FROM HOUSE_ON_RENT AS HR
          WHERE HR.annualRate > 0 AND HR.employee_id = :empId
      ) AS combined

      UNION ALL

      -- Grand total row (document is empty)
      SELECT 'GRAND_TOTAL' AS declaration_type, SUM(total_amount) AS total_amount, '' AS document
      FROM (
          SELECT ED.amount AS total_amount
          FROM EMPLOYEE_DECLARATION AS ED
          WHERE ED.amount > 0 AND ED.employee_id = :empId

          UNION ALL

          SELECT HR.annualRate AS total_amount
          FROM HOUSE_ON_RENT AS HR
          WHERE HR.annualRate > 0 AND HR.employee_id = :empId
      ) AS total_sum;
      `,
      {
        replacements: { empId: employee_id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      code: 200,
      message: `Type-wise totals + documents + grand total for employee_id ${employee_id}`,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      code: 500,
      message: "Error fetching total sum",
      error: error.message,
    });
  }
};



