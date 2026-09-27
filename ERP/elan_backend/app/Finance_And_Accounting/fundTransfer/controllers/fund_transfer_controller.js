const { response } = require("express");
const Sequelize = require("sequelize");
const db = require("../../../models/index");
const { Op, where } = require("sequelize");

const fund_transfer = db.fund_transfer;
const fundTransferApprovalLevel = db.fundTransferApprovalLevel;
const userDetails = db.user;



exports.requestCashbookRequest = async (req, res) => { 
    try {
      
      const {entity_id,employee_id} = req.body;
      const {
        amount_for_request,
        department_id,
        expense_type,
        uploade_file,
        reason,
        remark,
        request_date,
        require_by,
        fund_request_no
      } = req.body.requestCashBookform;
  
      const payload = {
        amount_for_request,
        department_id,
        expense_type,
        uploade_file,
        reason,
        remark,
        request_date,
        require_by,
        fund_request_no,
        entity_id,
        employee_id
      };


      const [query] = await db.sequelize.query(`
        SELECT WFM.job_name, WR.employee_id, WR.role_id, WR.level, WR.id
        FROM ESS_WORK_FLOW_MASTER AS WFM
        LEFT JOIN ESS_WORKFLOW_RANGE AS WR ON WR.workflow_id = WFM.id
        WHERE WFM.status = 'ACTIVE' AND WFM.isDeleted = 0 AND WFM.department_id = ${department_id} AND
        WR.status = 'ACTIVE' AND WR.isDeleted = 0 AND WFM.job_name = 'Fund Transfer' 
    `);

    if (query.length > 0) {
      console.log(query);

      const createData = await db.fund_transfer.create(payload);

    if (createData) {
        
        const FundTransferId = createData.id;

        const approvalLevels = query.map(item => ({
            level: item.level,
            employee_id: item.employee_id,
            // role_id: item.role_id,
            fund_transfer_id: FundTransferId  ,
            workflow_range_id: item.id
        }));

        // Insert all approval levels
        await db.fundTransferApprovalLevel.bulkCreate(approvalLevels);

        return res.status(200).send({ code: 200, message: 'Fund Transfer request Successfully' });
    } else {
        return res.status(400).send({ code: 400, message: 'Error generating Fund Transfer!!' });
    }
} else {
    return res.status(501).send({ code: 501, message: 'Workflow is not created!!' });
}

    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
    }
  };

//   exports.getAllFundRequest = async (req, res) => {
//     try {
//       const entity_id = req.params.id;
//         const [query] = await db.sequelize.query(`SELECT * FROM Fund_Transfer 
//           WHERE entity_id = ${entity_id} AND isDeleted = '0'`);
//          if (query.length > 0) {
//             return res
//                 .status(200)
//                 .send({
//                     code: 200,
//                     message: "Fetched Department Successfully !",
//                     data: query,
//                 });
//         } else {
//             return res
//                 .status(404)
//                 .send({ code: 404, message: "Record Not Found", data: query });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message });
//     }
//   };




  exports.getAllFundRequest = async (req, res) => {
    try {
        
        const loggedEmployeeId = req.query.id;
        const entity_id = req.query?.entity_id;
        let role = req.query?.role;

        let condition1 = '';
        let condition2 = '';
        let condition3 = '';
        let condition4 = '';

        if (role !== 'Super Admin'){
            
            condition1 += ` AND la.employee_id= ${loggedEmployeeId} `
            condition2 += ` pa.employee_id = ${loggedEmployeeId} AND `
            condition3 += ` OR FT.employee_id= ${loggedEmployeeId} `
            
        }

        else {
         condition4 += ` GROUP BY FT.id `
        }


        const query = `SELECT MD.department_name, MAX(la.approval_status) AS approval_status , FT.*  , CONCAT(HRU.first_name, ' ', HRU.last_name) AS employee_name,
          (SELECT la_inner.approval_status 
     FROM FUND_TRANSFER_APPROVAL_LEVEL AS la_inner 
     WHERE la_inner.fund_transfer_id = FT.id 
     AND la_inner.approval_status IN ('APPROVED', 'REJECTED', 'PENDING')
     ORDER BY la_inner.level
     LIMIT 1) AS latest_approval_status,

      (SELECT la_inner.level 
     FROM FUND_TRANSFER_APPROVAL_LEVEL AS la_inner 
     WHERE la_inner.fund_transfer_id = FT.id AND la_inner.employee_id = ${loggedEmployeeId}
     AND la_inner.approval_status IN ('APPROVED', 'REJECTED','PENDING')
     ORDER BY la_inner.level DESC
     LIMIT 1) AS level
        FROM Fund_Transfer AS FT 

LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = FT.employee_id 
LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = FT.department_id
      LEFT JOIN FUND_TRANSFER_APPROVAL_LEVEL as la ON la.fund_transfer_id=FT.id ${condition1} WHERE (FT.id IN (
          SELECT pa.fund_transfer_id FROM FUND_TRANSFER_APPROVAL_LEVEL AS pa 
          WHERE ${condition2} (
              (pa.level = 1)
              OR 
              (
                  pa.level > 1 
                  AND 
                  (
                      SELECT COUNT(pl.id) 
                      FROM FUND_TRANSFER_APPROVAL_LEVEL AS pl 
                      WHERE pl.fund_transfer_id = pa.fund_transfer_id 
                      AND pl.level = (pa.level - 1)  
                      AND pl.approval_status = 'APPROVED' 
                      AND pl.progress_status = 'CLOSE'
                  ) > 0
              )
          )
    ) ${condition3} ) AND FT.entity_id = ${entity_id} ${condition4} ORDER BY FT.id DESC
  `;
        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        return res.status(200).json({ code: 200, message: "Success", data: data });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}







  exports.generateFundRequestNo = async (req, res) => {
    try {
        const fr_Variable = "FR";
        const lastEntry = await db.fund_transfer.findOne({
            where: { status: "ACTIVE" ,isDeleted: false},
            order: [['id', 'DESC']],
            attributes: ["fund_request_no", "id"]
        });

        if (lastEntry != null) {
            const last_digit = lastEntry.fund_request_no
            if (last_digit) {
                const lastNumber = parseInt(last_digit.slice(-2), 10);
                var number = lastNumber + 1;
            } else if (last_digit.length == 0 || last_digit.length == null) {
                var number = 1;
            }
        } else {
            var number = 1;
        }
        const code = `${number}`.padStart(3, '0');
        const fr_number = fr_Variable + code;
        if (fr_number === "") {
            return res.status(200).send({ code: 200, message: "PR Number Not Generated", data: null });
        } else {
            return res.status(200).send({ code: 200, message: "FR Number has been Generated Fund Request", data: fr_number });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
  }


  exports.getAllFundTransferApprovalLevel = async (req, res) => {
    try {
        
        const fund_transfer_id = req.params.fund_transfer_id;

        const getData = await db.fundTransferApprovalLevel.findAll({
            where: {
                [Op.and]: [
                    { fund_transfer_id: fund_transfer_id },
                ],
            },
            attributes: ["approval_status", "level", "employee_id", "remarks"],
        });

        if (!getData || getData.length === 0) {
            return res.status(200).send({ code: 400, message: "Data not found" });
        }

        const levelsWithNames = [];
        for (const levelInfo of getData) {
            const employeeInfo = await userDetails.findOne({
                where: {
                    employee_id: levelInfo.employee_id,
                },
                attributes: ["first_name", "last_name"],
            });

            if (!employeeInfo) {
                return res.status(400).send({
                    code: 400,
                    message: "User not found for level " + levelInfo.level,
                });
            }

            const fullName = `${employeeInfo.first_name} ${employeeInfo.last_name}`;
            const levelWithName = {
                level: levelInfo.level,
                name: fullName,
                status: levelInfo.approval_status,
                remarks: levelInfo.remarks

            };
            levelsWithNames.push(levelWithName);
        }

        return res.status(200).send({
            code: 200,
            message: "Data Fetched Successfully!",
            data: levelsWithNames,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Server Error" });
    }
}



module.exports.getFundTransferById = async (req, res) => { 
    try {
        let id = req.query?.id;
        let employee_id = req.query?.emp_id;
          const [query] = await db.sequelize.query(`SELECT FT.*, MD.department_name, concat(HRU.first_name, ' ', HRU.last_name) AS employee_name FROM Fund_Transfer AS FT 
LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = FT.department_id
LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = FT.employee_id 
WHERE FT.id = ${id}`);
    
    
           if (query.length > 0) {



            const [levelData] = await db.sequelize.query(`
                SELECT FT.id, 
                    (SELECT la_inner.level 
                     FROM FUND_TRANSFER_APPROVAL_LEVEL AS la_inner 
                     WHERE la_inner.fund_transfer_id = FT.id 
                     AND la_inner.employee_id = ${employee_id}
                     AND la_inner.approval_status IN ('APPROVED', 'REJECTED', 'PENDING')
                     ORDER BY la_inner.level DESC
                     LIMIT 1) AS level
                FROM Fund_Transfer AS FT 
                WHERE FT.id = ${id}
            `);

            // Extract level from the query result
            const level = levelData[0].level ? levelData[0].level : null;

            const newData = {
                query,
                level: level
            };
            

              return res
                  .status(200)
                  .send({
                      code: 200,
                      message: "Fetched Data Successfully !",
                      data: newData,
                  });
          } else {
              return res
                  .status(200)
                  .send({ code: 404, message: "Record Not Found", data: query });
          }
      } catch (error) {
          return res.status(500).send({ code: 500, message: error.message });
      }
  };







  
exports.approvedFundTransferById = async (req, res) => {
    try {
        const fund_transfer_id = req.params.fund_transfer_id;
        const {

            remarks, emp_id, approval_status, progress_status, role, amount, entity_id
        } = req.body;
        let updateData;
        if (approval_status == 'REJECTED') {


            
        if (role === 'Super Admin'){
            await fund_transfer.update({ status: 'REJECTED' }, { where: { id: fund_transfer_id } });

            updateData = await fundTransferApprovalLevel.update(
                {
                    approval_status: approval_status,
                    progress_status: progress_status,
                    remarks: remarks
                },
                {
                    where: {
                        fund_transfer_id: fund_transfer_id
                    },
                }
            );
        }

        else{
            await fund_transfer.update({ status: 'REJECTED' }, { where: { id: fund_transfer_id } });
    
            updateData = await fundTransferApprovalLevel.update(
                {
                    approval_status: approval_status,
                    progress_status: progress_status,
                    remarks: remarks
                },
                {
                    where: {
                        employee_id: emp_id,
                        fund_transfer_id: fund_transfer_id
                    },
                }
            );
        }

          

        } else {


            if(role === 'Super Admin'){
                await fund_transfer.update({ status: 'APPROVED' }, { where: { id: fund_transfer_id } });

                updateData = await fundTransferApprovalLevel.update(
                    {
                        approval_status: approval_status,
                        progress_status: progress_status,
                        remarks: remarks
                    },
                    {
                        where: {
                            fund_transfer_id: fund_transfer_id
                        },
                    }
                );

                db.financial_And_Account_Journal_List.create({
                    debit_amount:amount,
                    chart_account_id: 6,
                    entry_status: 'Fund Transfer',
                    entity_id: entity_id
                  })
          
                  db.financial_And_Account_Journal_List.create({
                    credit_amount:amount,
                    chart_account_id: 4,
                    entry_status: 'Fund Transfer',
                    entity_id: entity_id
                  })



            }

else{
    updateData = await fundTransferApprovalLevel.update(
        {
            approval_status: approval_status,
            progress_status: progress_status,
            remarks: remarks
        },
        {
            where: {
                employee_id: emp_id,
                fund_transfer_id: fund_transfer_id
            },
        }
    );
}
          
        }
        if(role !== 'Super Admin'){
        if (approval_status == 'APPROVED') {
            const allLevelsData = await fundTransferApprovalLevel.findAll({
                where: {
                    employee_id: emp_id,
                    fund_transfer_id: fund_transfer_id
                },
                order: [["level", "ASC"]],
            });

            let maxLevel;
            if (allLevelsData !== null) {
                maxLevel = await fundTransferApprovalLevel.max('level', {
                    where: { fund_transfer_id: fund_transfer_id }
                });                
            }

            const currentLevel = await fundTransferApprovalLevel.findOne({
                attributes: ["level"],
                where: {
                    employee_id: emp_id,
                    fund_transfer_id: fund_transfer_id
                },
            });

            const maxLevelValue = maxLevel ;

            const currentLevelValue = currentLevel.level;

            if (maxLevelValue !== null && currentLevelValue !== null && currentLevelValue === maxLevelValue) {
                const currentApprovelStatus = await fund_transfer.findOne({
                    where: { id: fund_transfer_id },
                });

                if (currentApprovelStatus !== null) {
                    const finalApproved = await fund_transfer.update(
                        { status: "APPROVED" },
                        { where: { id: fund_transfer_id } }
                    );

                    db.financial_And_Account_Journal_List.create({
                        debit_amount:amount,
                        chart_account_id: 6,
                        entry_status: 'Fund Transfer',
                        entity_id: entity_id
                      })
              
                      db.financial_And_Account_Journal_List.create({
                        credit_amount:amount,
                        chart_account_id: 4,
                        entry_status: 'Fund Transfer',
                        entity_id: entity_id
                      })

                    return res.status(200).send({
                        code: 200,
                        message: "Fund Transfer Approved Successfully. This One must be the last level.",
                        data: finalApproved,
                    });
                }
            }
        }
    }
        if (updateData !== 0 ) {
            return res.status(200).send({
                code: 200,
                message: "Fund Transfer Approval Successfully",
                data: updateData,
            });
        }
     
        else {
            return res.status(200).send({ code: 200, message: "Unable to Update", data: updateData });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Server Error" });
    }
}