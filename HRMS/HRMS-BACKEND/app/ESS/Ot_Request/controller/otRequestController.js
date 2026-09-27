const db = require("../../../models/index");

const logger = require("../../../../logger/index");
const { request } = require("express");
class extrahourRequestController {
  async create_OvertimeRequest(req, res) {
    try {
      const { employee_id, entity_id, department_id, rows, created_by } =
        req.body;

      if (
        !employee_id ||
        !entity_id ||
        !department_id ||
        !Array.isArray(rows) ||
        rows.length === 0
      ) {
        return res
          .status(403)
          .send({ code: 403, message: "All fields required!" });
      }

      // 🔍 Get workflow master
      const getData = await db.WorkFlow_Master.findOne({
        where: { entity_id, job_name: "Overtime", department_id },
      });
      if (!getData) {
        return res
          .status(500)
          .send({
            code: 500,
            message: "Workflow is not created for this department!",
          });
      }

      const getLevels = await db.Work_Flow_range.findAll({
        where: { workflow_id: getData.id, status: "ACTIVE" },
        attributes: ["level", "employee_id", "role_id", "workflow_id"],
      });

      let createdRequests = [];

      // 🔹 Each row = new parent request
      for (let row of rows) {
        const request = await db.overtime_Request.create({
          employee_id,
          entity_id,
          department_id,
          created_by,
        });

        // approvers for each requests
        for (const level of getLevels) {
          await db.overtime_Approver.create({
            level: level.level,
            employee_id: level.employee_id,
            request_id: request.id,
          });
        }

        // detail for this request
        await db.overtime_Request_Details.create({
          request_id: request.id,
          from_date: row.from_date,
          from_time: row.from_time,
          to_date: row.to_date,
          to_time: row.to_time,
          total_hour: row.total_hours,
          employee_remark: row.employee_remark,
        });

        createdRequests.push(request);
      }
      // response
      return res.status(200).send({
        code: 200,
        message: "Requests created successfully!",
        data: createdRequests,
      });
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res
        .status(500)
        .send({
          code: 500,
          message: error.message || "Internal Server Error!",
        });
    }
  }

  //   async get_all_ot_req(req, res) {
  //     try {
  //       const { entity_id, employee_id } = req.body;

  //       let baseQuery = `
  // SELECT 
  //     R.employee_id,
  //     U.employee_code,
  //     CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
  //     D.department_name,
  //     U.employee_official_email,
  //     U.contact_number,
  //     R.approval_status,
  //     MAX(R.id) AS request_id
  // FROM 
  //     ESS_OVERTIME_REQUEST AS R
  // INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = R.employee_id
  // INNER JOIN MASTER_DEPARTMENT AS D ON D.dept_id = R.department_id
  // WHERE 
  //     R.entity_id = ${entity_id}
  //     AND (R.created_by = ${employee_id}  OR R.employee_id = ${employee_id} )
  // GROUP BY 
  //     R.employee_id, 
  //     U.employee_code, 
  //     U.first_name, 
  //     U.last_name, 
  //     D.department_name, 
  //     U.employee_official_email, 
  //     U.contact_number, 
  //     R.approval_status
  //     ORDER BY 
  //     request_id DESC;

  //     `;

  //       const [response] = await db.sequelize.query(baseQuery);

  //       return res.status(200).send({ code: 200, data: response });
  //     } catch (error) {
  //       logger.error(`Error ${error.message}`, { error });
  //       console.error(error);
  //       return res.status(500).send({
  //         code: 500,
  //         message: error.message || "Internal Server Error!",
  //       });
  //     }
  //   }


  async get_all_ot_req(req, res) {
    try {
      const { entity_id, employee_id } = req.body;

      let baseQuery = `
   SELECT 
        R.employee_id,
        U.employee_code,
        CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
        D.department_name,
        U.employee_official_email,
        U.contact_number,
            R.approval_status,
        MAX(R.id) AS request_id,
        R.created_by,
        CONCAT(CU.first_name, ' ', CU.last_name) AS created_by_name
      FROM 
        ESS_OVERTIME_REQUEST AS R
      INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = R.employee_id
      INNER JOIN MASTER_DEPARTMENT AS D ON D.dept_id = R.department_id
      LEFT JOIN HRMS_REGISTERED_USER AS CU 
      ON CU.employee_id = R.created_by
      WHERE 
          R.entity_id = ${entity_id}
      AND (R.created_by = ${employee_id} OR R.employee_id = ${employee_id})
    `;

      baseQuery += `
      GROUP BY 
       R.id,
        R.employee_id,
        U.employee_code,
        U.first_name,
        U.last_name,
        D.department_name,
        U.employee_official_email,
        U.contact_number
          ORDER BY R.id DESC
    `;

      const [response] = await db.sequelize.query(baseQuery);

      return res.status(200).send({ code: 200, data: response });
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error!",
      });
    }
  }


  async get_ot_requests_by_status(req, res) {
    try {
      const { entity_id, employee_id, status } = req.body;

      let baseQuery = `
    SELECT 
        R.employee_id,
        U.employee_code,
        CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
        D.department_name,
        U.employee_official_email,
        U.contact_number,
            HP.approval_status,
        MAX(R.id) AS request_id,
        R.created_by,
        CONCAT(CU.first_name, ' ', CU.last_name) AS created_by_name
      FROM 
        ESS_OVERTIME_REQUEST AS R
      INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = R.employee_id
      INNER JOIN ESS_OVERTIME_REQUEST_DETAILS AS RD ON RD.request_id = R.id
      INNER JOIN ESS_OVERTIME_APPROVER AS HP ON HP.request_id=R.id
      INNER JOIN MASTER_DEPARTMENT AS D ON D.dept_id = R.department_id
      LEFT JOIN HRMS_REGISTERED_USER AS CU 
      ON CU.employee_id = R.created_by 
      WHERE 
        HP.approval_status='${status}' AND HP.employee_id=${employee_id}
    `;

      baseQuery += `
      GROUP BY 
       R.id,
        R.employee_id,
        U.employee_code,
        U.first_name,
        U.last_name,
        D.department_name,
        U.employee_official_email,
        U.contact_number
          ORDER BY R.id DESC
    `;

      const [response] = await db.sequelize.query(baseQuery);

      return res.status(200).send({ code: 200, data: response });
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error!",
      });
    }
  }

  async get_requestById(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(403).send({
          code: 403,
          message: "Id is required!",
        });
      }

      const [request] = await db.sequelize.query(
        `
  SELECT 
    U.employee_code,
    CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
    D.department_name,
    R.employee_id,
    R.department_id,
    R.created_by,
    R.entity_id,
    HP.approver_remark
  FROM 
    ESS_OVERTIME_REQUEST AS R
  INNER JOIN HRMS_REGISTERED_USER AS U 
    ON U.employee_id = R.employee_id
  INNER JOIN MASTER_DEPARTMENT AS D 
    ON D.dept_id = R.department_id
  INNER JOIN ESS_OVERTIME_APPROVER AS HP 
    ON HP.request_id = R.id
  WHERE R.id = :id
  
  `,
        {
          replacements: { id },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      if (!request) {
        return res.status(404).send({
          code: 404,
          message: "Request not found",
        });
      }

      const request_details = await db.overtime_Request_Details.findAll({
        where: { request_id: id },
      });

      const [Approver_details] = await db.sequelize.query(`SELECT 
    U.employee_code,
    CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
    HP.approver_remark
  FROM 
    ESS_OVERTIME_REQUEST AS R
   INNER JOIN ESS_OVERTIME_APPROVER AS HP ON HP.request_id=R.id
  INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = HP.employee_id
  WHERE R.id=${id} `);

      return res.status(200).send({
        code: 200,
        message: "Request fetched successfully!",
        data: {
          request,
          request_details,
          Approver_details,
        },
      });
    } catch (error) {
      logger.error(`Error: ${error.message}`, { error });
      console.error(error);
      return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error!",
      });
    }
  }


  async update_OvertimeRequest(req, res) {
    try {
      const { id, employee_id, entity_id, department_id, rows, created_by } = req.body;

      if (
        !id ||
        !employee_id ||
        !entity_id ||
        !department_id ||
        !Array.isArray(rows) ||
        rows.length === 0
      ) {
        return res
          .status(403)
          .send({ code: 403, message: "All fields required!" });
      }


      const existingRequest = await db.overtime_Request.findOne({
        where: { id, employee_id, entity_id, department_id },
      });

      if (!existingRequest) {
        return res
          .status(404)
          .send({ code: 404, message: "Overtime request not found!" });
      }


      await existingRequest.update({
        employee_id,
        entity_id,
        department_id,
        created_by,
      });


      await db.overtime_Request_Details.destroy({
        where: { request_id: id },
      });


      for (let row of rows) {
        await db.overtime_Request_Details.create({
          request_id: id,
          from_date: row.from_date,
          from_time: row.from_time,
          to_date: row.to_date,
          to_time: row.to_time,
          total_hour: row.total_hours,
          employee_remark: row.employee_remark,
        });
      }

      return res.status(200).send({
        code: 200,
        message: "Overtime request updated successfully!",
      });
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res
        .status(500)
        .send({
          code: 500,
          message: error.message || "Internal Server Error!",
        });
    }
  }



  // async approveORReject_Request(req, res) {
  //   try {
  //     const {
  //       status,
  //       selectedId,
  //       entity_id,
  //       employee_id,
  //       created_by,
  //       request_id,
  //       approver_remark,
  //     } = req.body;

  //     let response = [];

  //     // ✅ pick payroll month/year from first row (assuming all rows same period)
  //     let payroll_month = selectedId[0]?.payroll_month || null;
  //     let payroll_year = selectedId[0]?.payroll_year || null;

  //     if (status === "APPROVED") {
  //       // Update approver table
  //       await db.overtime_Approver.update(
  //         { approval_status: "APPROVED", approver_remark },
  //         { where: { request_id } }
  //       );

  //       // ✅ Update details row by row
  //       for (let row of selectedId) {
  //         if (!row?.id) continue;

  //         // 🔍 Find rate based on this row’s approve_hours
  //         let overtimeRateRow = await db.overTime.findOne({
  //           where: {
  //             entity_id,
  //             from_range: { [db.Sequelize.Op.lte]: row.approve_hours },
  //             to_range: { [db.Sequelize.Op.gte]: row.approve_hours }, 
  //             isDeleted: 0,
  //             status: "ACTIVE",
  //           },
  //           order: [["from_range", "DESC"]],
  //         });


  //         let applied_rate = overtimeRateRow ? overtimeRateRow.rate : null;

  //         let data = await db.overtime_Request_Details.update(
  //           {
  //             approve_hours: row.approve_hours,
  //             payroll_month: row.payroll_month ?? payroll_month,
  //             payroll_year: row.payroll_year ?? payroll_year,
  //             applied_rate,
  //           },
  //           { where: { id: row.id } }
  //         );

  //         response.push(data);
  //       }

  //       // ✅ Update parent request table
  //       await db.overtime_Request.update(
  //         {
  //           approval_status: "APPROVED",
  //           status: "ACTIVE",
  //           approver_remark,
  //         },
  //         { where: { id: request_id } }
  //       );
  //     } else {
  //       // If REJECTED
  //       for (let row of selectedId) {
  //         if (!row?.id) continue;

  //         // 🔍 Still calculate applied_rate row-wise for consistency
  //         let overtimeRateRow = await db.overTime.findOne({
  //           where: {
  //             entity_id,
  //             min_time: { [db.Sequelize.Op.lte]: row.approve_hours },
  //             isDeleted: 0,
  //             status: "ACTIVE",
  //           },
  //           order: [["min_time", "DESC"]],
  //         });

  //         let applied_rate = overtimeRateRow ? overtimeRateRow.rate : null;

  //         let data = await db.overtime_Request_Details.update(
  //           {
  //             approve_hours: row.approve_hours,
  //             payroll_month,
  //             payroll_year,
  //             applied_rate,
  //           },
  //           { where: { id: row.id } }
  //         );

  //         response.push(data);
  //       }

  //       await db.overtime_Approver.update(
  //         { approval_status: "REJECTED", approver_remark },
  //         { where: { request_id } }
  //       );

  //       await db.overtime_Request.update(
  //         {
  //           approval_status: "REJECTED",
  //           status: "INACTIVE",
  //           approver_remark,
  //         },
  //         { where: { id: request_id } }
  //       );
  //     }

  //     return res.status(200).send({
  //       code: 200,
  //       message: "Request updated successfully!",
  //       data: response,
  //     });
  //   } catch (error) {
  //     logger.error(`Error: ${error.message}`, { error });
  //     console.error(error);
  //     return res.status(500).send({
  //       code: 500,
  //       message: error.message || "Internal Server Error!",
  //     });
  //   }
  // }



async approveORReject_Request(req, res) {
  try {
    const {
      status,
      selectedId,
      entity_id,
      employee_id,
      created_by,
      request_id,
      approver_remark,
    } = req.body;

    let response = [];

    let payroll_month = selectedId[0]?.payroll_month || null;
    let payroll_year = selectedId[0]?.payroll_year || null;

    // ✅ Helper function: first matching range, fallback highest
    async function getAppliedRate(entity_id, approve_hours) {
      // 1️⃣ First range that matches
      let rateRow = await db.overTime.findOne({
        where: {
          entity_id,
          from_range: { [db.Sequelize.Op.lte]: approve_hours },
          to_range: { [db.Sequelize.Op.gte]: approve_hours },
          isDeleted: 0,
          status: "ACTIVE",
        },
        order: [["id", "ASC"]], // first inserted row
      });

      // 2️⃣ Fallback: highest range if no match
      if (!rateRow) {
        rateRow = await db.overTime.findOne({
          where: { entity_id, isDeleted: 0, status: "ACTIVE" },
          order: [["to_range", "DESC"]],
        });
      }

      return rateRow;
    }

    // ✅ Process all rows
    for (let row of selectedId) {
      if (!row?.id) continue;

      const overtimeRateRow = await getAppliedRate(entity_id, row.approve_hours);
      const applied_rate = overtimeRateRow ? overtimeRateRow.rate : null;

      await db.overtime_Request_Details.update(
        {
          approve_hours: row.approve_hours,
          payroll_month: row.payroll_month ?? payroll_month,
          payroll_year: row.payroll_year ?? payroll_year,
          applied_rate,
        },
        { where: { id: row.id } }
      );

      response.push({
        rowId: row.id,
        approve_hours: row.approve_hours,
        applied_rate,
        applied_from_range: overtimeRateRow?.from_range || null,
        applied_to_range: overtimeRateRow?.to_range || null,
      });
    }

    // ✅ Update approver table
    await db.overtime_Approver.update(
      { approval_status: status, approver_remark },
      { where: { request_id } }
    );

    // ✅ Update parent request table
    await db.overtime_Request.update(
      {
        approval_status: status,
        status: status === "APPROVED" ? "ACTIVE" : "INACTIVE",
        approver_remark,
      },
      { where: { id: request_id } }
    );

    return res.status(200).send({
      code: 200,
      message: "Request updated successfully!",
      data: response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error!",
    });
  }
}





  // async approveORReject_Request(req,res){
  //  try{
  //    const{status,selectedId,entity_id,employee_id,created_by,request_id,approver_remark}=req.body;
  //    let response=[];
  //    if(status=='APPROVED'){
  //       await db.overtime_Approver.update(
  //             { approval_status: 'APPROVED',approver_remark },
  //             { where: { request_id: request_id } }
  //           );

  //         let all_record=await db.overtime_Approver.findAll({
  //           where:{
  //             request_id: request_id
  //           }
  //         })

  //     let total_length = all_record.length;
  //     let approve_total = all_record.filter(record => record?.approval_status === "APPROVED").length;
  //     if(total_length==approve_total){
  //        let [extrahour_MASTER]=await db.sequelize.query(`
  //         SELECT H.from,H.to,H.percentage FROM MASTER_EXTRA_HOUR AS H WHERE H.entity_id=${entity_id} AND H.status='ACTIVE' AND H.isDeleted=0`);
  //         if(extrahour_MASTER.length==0){
  //           return res.status(403).send({code:403,message:'Please Create Extra Hour for this Entity!'})
  //         }
  //         let [employee_details]=await db.sequelize.query(`
  //           SELECT u.salary_per_day,u.basic_salary,u.salary_per_hr,
  //           u.employee_id,u.municipality_id,
  //           u.region_id FROM
  //           HRMS_REGISTERED_USER AS u WHERE u.employee_id=${employee_id};
  //           `);
  //         for (let row of selectedId) {
  //         if (!row?.id) continue;
  //           let fromDate = new Date(row.from_date);
  //           let toDate = new Date(row.to_date);
  //           let fromDetails = formatDateDetails(fromDate);
  //           let toDetails;
  //           let to_hour=0;
  //           let from_hour=0;

  //           if(row.from_date!=row.to_date){
  //             toDetails = formatDateDetails(toDate);
  //           }

  //           let employee = employee_details[0];

  //           let [holiday_Details]=await db.sequelize.query(`
  //                           SELECT
  //                 DATE(H.date) AS holiday_date,
  //                 H.name_of_municipality,
  //                 H.region_name,
  //                 H.forAllYear
  //               FROM MASTER_HOLIDAY AS H
  //               WHERE H.name_of_municipality = ${employee?.municipality_id}
  //                 AND JSON_CONTAINS(H.region_name, '${employee?.region_id}')
  //                 AND H.entity_id=${entity_id}
  //                 AND (
  //                   CASE
  //                     WHEN H.forAllYear = 'YES'
  //                       THEN DATE_FORMAT(H.date, '%m-%d') BETWEEN '${fromDetails?.monthDay}' AND '${toDetails?.monthDay}'
  //                     ELSE DATE(H.date) BETWEEN '${row.from_date}' AND '${row.to_date}'
  //                   END
  //                 );
  //             `)
  // if (fromDate.toDateString() !== toDate.toDateString()) {
  //     let fromDateTime = new Date(`${row.from_date}T${row.from_time}`);
  //     let endOfFromDate = new Date(`${row.from_date}T23:59:59`);

  //     let startOfToDate = new Date(`${row.to_date}T00:00:00`);
  //     let toDateTime = new Date(`${row.to_date}T${row.to_time}`);

  //     let fromHours = (endOfFromDate - fromDateTime) / (1000 * 60 * 60);
  //     let toHours = (toDateTime - startOfToDate) / (1000 * 60 * 60);

  //     let totalHours = Number(row.total_hours);
  //     let approvedHours = Number(row.approve_hours);

  //     if (totalHours !== approvedHours) {
  //         let approved = approvedHours;

  //         if (approved <= fromHours) {
  //             fromHours = approved;
  //             toHours = 0;
  //         } else {
  //             toHours = approved - fromHours;
  //         }

  //         from_hour = Number(fromHours.toFixed(2));
  //         to_hour = Number(toHours.toFixed(2));
  //     }else{
  //         from_hour = Number(fromHours.toFixed(2));
  //         to_hour = Number(toHours.toFixed(2));
  //     }
  // }
  //             let extraSalary_amount = 0;
  //         if (row.total_hours) {
  //           for (let hour of extrahour_MASTER) {
  //             if (
  //               row.approve_hours >= hour.from &&
  //               row.approve_hours <= hour.to
  //             ) {

  //             let toHourAmount = 0;
  //             let fromHourAmount = 0;

  //             if (hour.percentage && employee.salary_per_hr) {
  //               let fromMultiplier = 1;
  //               let toMultiplier = 1;

  //               const holiday = holiday_Details?.[0];
  //               const forAllYear = holiday?.forAllYear === 'YES';

  //               const isFromHoliday = forAllYear
  //                 ? holiday?.holiday_date?.includes(fromDetails?.monthDay)
  //                 : holiday?.holiday_date === row.from_date;

  //               const isToHoliday = forAllYear
  //                 ? holiday?.holiday_date?.includes(toDetails?.monthDay)
  //                 : holiday?.holiday_date === row.to_date;

  //               if (fromDetails != null && (fromDetails.dayName === 'Saturday' || fromDetails.dayName === 'Sunday' || isFromHoliday)) {
  //                 fromMultiplier = 2;
  //               }

  //               if (toDetails != null && (toDetails.dayName === 'Saturday' || toDetails.dayName === 'Sunday' || isToHoliday)) {
  //                 toMultiplier = 2;
  //               }
  //               if(from_hour==0){
  //                    from_hour=row?.approve_hours;
  //               }

  //               fromHourAmount = truncateToTwoDecimals(
  //                 employee.salary_per_hr * (from_hour || 0) * (hour.percentage / 100) * fromMultiplier
  //               );

  //               toHourAmount = truncateToTwoDecimals(
  //                 employee.salary_per_hr * (to_hour || 0) * (hour.percentage / 100) * toMultiplier
  //               );

  //               extraSalary_amount = Math.round((fromHourAmount + toHourAmount) * 100) / 100;
  //             }

  //              if(from_hour!=0){
  //                await db.payroll_work_hour.create({
  //                 employee_id: employee_id,
  //                 created_by: created_by,
  //                 amount: fromHourAmount,
  //                 extra_hour: from_hour,
  //                 year:fromDetails?.year,month:fromDetails?.month,entity_id,date:row.from_date,
  //                 percentage:hour.percentage
  //               });
  //              }
  //              if(to_hour!=0){
  //                await db.payroll_work_hour.create({
  //                 employee_id: employee_id,
  //                 created_by: created_by,
  //                 amount: toHourAmount,
  //                 extra_hour: to_hour,
  //                 year:toDetails?.year,month:toDetails?.month,entity_id,date:row.to_date,
  //                 percentage:hour.percentage
  //               });
  //              }
  //              break
  //             }

  //           }
  //           if(extraSalary_amount==0){

  //               return res.status(403).send({code:403,message:'Please create hour master first for this total hours!'})

  //           }
  //   }

  //   let data = await db.overtime_Request_Details.update(
  //     {approve_hours:row?.approve_hours },
  //     { where: { id: row.id } }
  //   );
  //   response.push(data);
  //      await db.overtime_Request.update(
  //             { approval_status: 'APPROVED' },
  //             { where: { id: request_id } }
  //           );

  // }
  //     }else{
  //       return res.status(200).send({code:200,message:'Update successfully!'});
  //     }

  //    }else{
  //        for(let row of selectedId){
  //         if (!row?.id) continue;
  //          let data= await db.overtime_Request_Details.update(
  //             { approve_hours:row?.approve_hours },
  //             { where: { id: row.id } }
  //           );
  //           response.push(data);
  //        }
  //        await db.overtime_Approver.update(
  //             { approval_status: 'REJECTED',approver_remark },
  //             { where: { request_id: request_id } }
  //           );
  //                 await db.overtime_Request.update(
  //             { approval_status: 'REJECTED' },
  //             { where: { id: request_id } }
  //           );
  //    }
  //    return res.status(200).send({code:200,message:'Request updated successfully!',data:response})
  //  }
  //  catch (error) {
  //     logger.error(`Error: ${error.message}`, { error });
  //     console.error(error);
  //     return res.status(500).send({
  //       code: 500,
  //       message: error.message || "Internal Server Error!",
  //     });
  //   }
  // }


  async get_employeeAttendence(req, res) {
    try {
      const { from_date, to_date, employee_id } = req.body;
      if (!from_date || !to_date || !employee_id) {
        return res
          .status(403)
          .send({
            code: 403,
            message: "From_date, To_date, employee_id is required!",
          });
      }
      let [response] = await db.sequelize.query(`
        SELECT A.att_checktime,A.entry_type,A.att_date
        FROM ESS_DAILY_ATTENDANCE AS A
        WHERE A.att_date BETWEEN '${from_date}' AND '${to_date}' AND A.employee_id=${employee_id};
        `);
      return res
        .status(200)
        .send({
          code: 200,
          message: "Employee attendence fetch successfully!",
          data: response,
        });
    } catch (error) {
      logger.error(`Error: ${error.message}`, { error });
      console.error(error);
      return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error!",
      });
    }
  }
}

function formatDateDetails(date) {
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  let dayName = date.toLocaleDateString("en-US", { weekday: "long" });

  return {
    year,
    month,
    day,
    dayName,
    monthDay: `${month}-${day}`,
  };
}
function truncateToTwoDecimals(num) {
  return Math.floor(num * 100) / 100;
}

module.exports = new extrahourRequestController();
