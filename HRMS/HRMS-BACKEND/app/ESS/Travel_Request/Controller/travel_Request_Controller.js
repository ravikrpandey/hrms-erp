const {
  attribute,
} = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const db = require("../../../models/index");
const Travel_model = db.travel_request;
const Travel_data = db.travel_request_data;
const Travel_approval = db.travel_approval;
const User_Model = db.user;
const Department_Model = db.department;
const WorkFlow = db.WorkFlow_Master;
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const axios = require("axios");
const { sendDynamicMail } = require("../../../Recruitment/utils/mail/mail");
const logger = require("../../../../logger/index");
const { where } = require("sequelize");
const { Op } = db.Sequelize;

/** get travel details */
// exports.get_Travel_details = async (req, res) => {
//   try {
//     let Obj = {};
//     const user_id = req.params.id;
//     const entity_id = req.params.entity_id;
//     const user_data = await db.user.findOne({
//       where: { employee_id: parseInt(user_id) },
//       attributes: [
//         "first_name",
//         "last_name",
//         "passport_number",
//         "department_id",
//       ],
//     });
//     if (user_data) {
//       const user_department = await Department_Model.findOne({
//         where: { dept_id: user_data.department_id },
//       });
//       Obj = {
//         Name: user_data.first_name + " " + user_data.last_name,
//         Department: user_department.department_name,
//         toDate: moment().format("DD-MM-YYYY"),
//         Passport: user_data.passport_number,
//         department_id: user_data.department_id,
//       };
//       const getData = await WorkFlow.findOne({
//         where: {
//           department_id: req.user.department_id,
//           entity_id: parseInt(entity_id),
//           job_name: "Travel Request",
//           status: "ACTIVE",
//         },
//         attributes: ["id"],
//       });

//       if (!getData) {
//         return res.status(500).send({
//           code: 500,
//           message: "Workflow is not created for required department!",
//           data: Obj,
//         });
//       }
//       return res
//         .status(200)
//         .send({ code: 200, message: "Data Fetched successfully", data: Obj });
//     } else {
//       return res.status(404).send({ code: "404", message: "No User found" });
//     }
//   } catch (error) {
//     logger.error(`Error ${error.message}`, { error });
//     console.log(error);
//     return res
//       .status(500)
//       .send({ code: 500, message: error.message || "Server Error" });
//   }
// };


exports.get_Travel_details = async (req, res) => {
  try {
    let Obj = {};
    const user_id = req.params.id;
    const entity_id = req.params.entity_id;
    const user_data = await db.user.findOne({
      where: { employee_id: parseInt(user_id) },
      attributes: [
        "first_name",
        "last_name",
        "passport_number",
        "department_id",
        "grade_id",
      ],
    });
    if (user_data) {
      const user_department = await Department_Model.findOne({
        where: { dept_id: user_data.department_id },
      });
      Obj = {
        Name: user_data.first_name + " " + user_data.last_name,
        Department: user_department.department_name,
        toDate: moment().format("DD-MM-YYYY"),
        Passport: user_data.passport_number,
        department_id: user_data.department_id,
        grade_id: user_data.grade_id 
      };
      const getData = await WorkFlow.findOne({
        where: {
          department_id: user_data.department_id,
          entity_id: parseInt(entity_id),
          job_name: "Travel Request",
          status: "ACTIVE",
        },
        attributes: ["id"],
      });
 
      if (!getData) {
        return res.status(500).send({
          code: 500,
          message: "Workflow is not created for required department!",
          data: Obj,
        });
      }
      return res
        .status(200)
        .send({ code: 200, message: "Data Fetched successfully", data: Obj });
    } else {
      return res.status(404).send({ code: "404", message: "No User found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/** Create travel request */
// exports.create_travel_request = async (req, res) => {
//   try {
//     const user_id = req.params.id;
//     let = {
//       Name,
//       Department,
//       current_date,
//       passport_number,
//       entity_id,
//       financial_year_id,
//       domesticLocations,
//       internationalLocations,
//       domesticAmount,
//       internationalAmount,
//       totalAmount,
//       unforeseenEvent,
//       remarks,
//       travel_document,
//       internationalAllowances,
//       domesticAllowances,
//       currency_id,
//       book_advance_status,
//     } = req.body;

//     if (current_date) {
//       current_date = moment(current_date, "DD/MM/YYYY").format("YYYY-MM-DD");
//     }

//     const latestTravel = await Travel_model.findOne({
//       where: { entity_id: parseInt(entity_id) },
//       order: [["createdAt", "DESC"]],
//     });
//     const serial_number = latestTravel
//       ? parseInt(latestTravel.travel_request_number.split("TRV")[1]) + 1
//       : 1;

//     if (!req.user.department_id) {
//       return res.status(404).send({
//         code: 404,
//         message: "Department id is not found, please login again!",
//       });
//     }

//     const get_data = await WorkFlow.findOne({
//       where: {
//         department_id: req.user.department_id,
//         entity_id: parseInt(entity_id),
//         job_name: "Travel Request",
//         status: "ACTIVE",
//       },
//       attributes: ["id"],
//     });

//     if (!get_data) {
//       return res.status(404).send({
//         code: 404,
//         message: "Workflow is not created for required department!",
//       });
//     }

//     const travelRequest = await Travel_model.create({
//       travel_request_number: "TRV" + serial_number,
//       entity_id: entity_id,
//       department_id: req.user.department_id,
//       user_id: user_id,
//       financial_year_id: financial_year_id,
//       travel_name: Name,
//       department: Department,
//       current_date: current_date,
//       passport_number: passport_number,
//       domestic_amount: domesticAmount || 0,
//       international_amount: internationalAmount || 0,
//       total_amount: totalAmount,
//       unforseen_event: unforeseenEvent,
//       travel_remarks: remarks,
//       travel_document: travel_document,
//       domestic_allowances: domesticAllowances,
//       international_allowances: internationalAllowances,
//       currency_id: currency_id,
//       book_advance_status: book_advance_status,
//     });

//     const travelRequestId = travelRequest.id;
//     const travelRequestData = [];
//     if (domesticLocations && domesticLocations.length > 0) {
//       for (const domesticLocation of domesticLocations) {
//         const data = {
//           include_hotel: domesticLocation.include_hotel || false,
//           number_of_days: domesticLocation.number_of_days || 0,
//           travel_type: "domestic",
//           travel_to_date: domesticLocation.domestic_to_date,
//           travel_from_date: domesticLocation.domestic_from_date,
//           hotel_name: domesticLocation.domestic_hotel_name || null,
//           travel_from_city_id: domesticLocation.domestic_from_city_id || null,
//           travel_to_city_id: domesticLocation.domestic_to_city_id || null,
//           travel_from_state_id: domesticLocation.domestic_from_state_id || null,
//           travel_to_state_id: domesticLocation.domestic_to_state_id || null,
//           travel_request_id: travelRequestId,
//         };

//         travelRequestData.push(data);
//         const trData = await db.travel_request_data.create(data);

//         const now = new Date(data.travel_from_date);
//         const year = now.getFullYear();
//         const month = now.getMonth() + 1; // 1-based
//         const lastMonth = month === 1 ? 12 : month - 1;
//         const lastMonthYear = month === 1 ? year - 1 : year;
//         const startOfLastMonth = new Date(lastMonthYear, lastMonth - 1, 1);
//         const endOfLastMonth = new Date(lastMonthYear, lastMonth, 0);

//         const travelPlan = await db.ESS_TRAVEL_PLAN.findAll({
//           where: {
//             employee_id: user_id,
//           },
//           include: [
//             {
//               model: db.ESS_TRAVEL_PLAN_DATA,
//               as: "plans",
//               attributes: ["id", "date", "plan_city_id", "actual_city_id"],
//               where: {
//                 date: {
//                   [Op.between]: [startOfLastMonth, endOfLastMonth],
//                 },
//               },
//             },
//           ],
//         });

//         console.log(travelPlan.dataValues);
//       }
//     }

//     const travel_id = travelRequest.id;

//     const get_levels = await db.Work_Flow_range.findAll({
//       where: {
//         workflow_id: get_data.id,
//         status: "ACTIVE",
//       },
//       attributes: ["level", "employee_id", "role_id", "workflow_id"],
//     });

//     const level_promises = get_levels.map(async (level) => {
//       const created_level = await Travel_approval.create({
//         level: level.level,
//         employee_id: level.employee_id,
//         workflow_id: level.workflow_id,
//         travel_request_id: travel_id,
//         role_id: level.role_id,
//         department_id: req.user.department_id,
//       });

//       if (level.level == 1) {
//         const employeeInfo = await db.user.findOne({
//           where: {
//             employee_id: level.employee_id,
//           },
//           attributes: ["employee_official_email", "first_name", "last_name"],
//         });

//         await sendDynamicMail(
//           employeeInfo.employee_official_email,
//           employeeInfo.first_name,
//           employeeInfo.last_name,
//           entity_id
//         );
//       }
//       return created_level;
//     });

//     await Promise.all(level_promises);

//     return res.status(200).send({
//       code: 200,
//       message: "Travel Request Created",
//       data: { travelRequest, travelRequestData },
//     });
//   } catch (error) {
//     logger.error(`Error ${error.message}`, { error });
//     console.error(error);
//     return res
//       .status(500)
//       .send({ code: 500, message: error.message || "Internal Server Error" });
//   }
// };

exports.create_travel_request = async (req, res) => {
  try {
    const user_id = req.params.id;
     const user = await db.user.findOne({
      where: { employee_id: user_id },
      attributes: ["employee_id", "first_name", "last_name", "department_id", "employee_code"], // jo fields chahiye
    });
 
    if (!user) {
      return res.status(404).send({
        code: 404,
        message: "User not found",
      });
    }
    let = {
      Name,
      Department,
      current_date,
      passport_number,
      entity_id,
      financial_year_id,
      domesticLocations,
      internationalLocations,
      domesticAmount,
      internationalAmount,
      totalAmount,
      unforeseenEvent,
      remarks,
      travel_document,
      internationalAllowances,
      domesticAllowances,
      currency_id,
      book_advance_status,
    } = req.body;
 
    if (current_date) {
      current_date = moment(current_date, "DD/MM/YYYY").format("YYYY-MM-DD");
    }
 
    const latestTravel = await Travel_model.findOne({
      where: { entity_id: entity_id },
      order: [["createdAt", "DESC"]],
    });
    const serial_number = latestTravel
      ? parseInt(latestTravel.travel_request_number.split("TRV")[1]) + 1
      : 1;
 
    const get_data = await WorkFlow.findOne({
      where: {
        department_id: user.department_id,
        entity_id: entity_id,
        job_name: "Travel Request",
        status: "ACTIVE",
      },
      attributes: ["id"],
    });
 
    if (!get_data) {
      return res.status(404).send({
        code: 404,
        message: "Workflow is not created for required department!",
      });
    }
 
    const travelRequest = await Travel_model.create({
      travel_request_number: "TRV" + serial_number,
      entity_id: entity_id,
      department_id: user.department_id,
      user_id: user_id,
      financial_year_id: financial_year_id,
      travel_name: Name,
      department: Department,
      current_date: current_date,
      passport_number: passport_number,
      domestic_amount: domesticAmount || 0,
      international_amount: internationalAmount || 0,
      total_amount: totalAmount,
      unforseen_event: unforeseenEvent,
      travel_remarks: remarks,
      travel_document: travel_document,
      domestic_allowances: domesticAllowances,
      international_allowances: internationalAllowances,
      currency_id: currency_id,
      book_advance_status: book_advance_status,
      travel_final_status: "PENDING",
    });
 
    const travelRequestId = travelRequest.id;
    const travelRequestData = [];
    if (domesticLocations && domesticLocations.length > 0) {
      for (const domesticLocation of domesticLocations) {
        const data = {
          include_hotel: domesticLocation.include_hotel || false,
          number_of_days: domesticLocation.number_of_days || 0,
          travel_type: "domestic",
          travel_to_date: domesticLocation.domestic_to_date,
          travel_from_date: domesticLocation.domestic_from_date,
          hotel_name: domesticLocation.domestic_hotel_name || null,
          travel_from_city_id: domesticLocation.domestic_from_city_id || null,
          travel_to_city_id: domesticLocation.domestic_to_city_id || null,
          travel_from_state_id: domesticLocation.domestic_from_state_id || null,
          travel_to_state_id: domesticLocation.domestic_to_state_id || null,
          travel_request_id: travelRequestId,
        };
        travelRequestData.push(data);
        const trData = await db.travel_request_data.create(data);
        const journeyBifurcations = domesticLocation.journeyBifurcation || [];
        if (journeyBifurcations && journeyBifurcations.length > 0) {
          for (const journey of journeyBifurcations) {
            await db.travel_journey_bifurcation.create({
              from_date: journey.from_date,
              travel_from_city_id: journey.travel_from_city_id,
              travel_to_city_id: journey.travel_to_city_id,
              travel_data_id: trData.id,
            });
          }
        }
      }
    }
 
    if (internationalLocations && internationalLocations.length > 0) {
      for (const internationalLocation of internationalLocations) {
        const data = {
          include_hotel: internationalLocation.include_hotel || false,
          number_of_days: internationalLocation.number_of_days || 0,
          travel_type: "international",
          travel_to_date: internationalLocation.international_to_date,
          travel_from_date: internationalLocation.international_from_date,
          hotel_name: internationalLocation.international_hotel_name || null,
          travel_from_city_id:
            internationalLocation.international_from_city_id || null,
          travel_to_city_id:
            internationalLocation.international_to_city_id || null,
          travel_from_country_id:
            internationalLocation.international_from_country_id || null,
          travel_to_country_id:
            internationalLocation.international_to_country_id || null,
          travel_from_state_id:
            internationalLocation.international_from_state_id || null,
          travel_to_state_id:
            internationalLocation.international_to_state_id || null,
          travel_request_id: travelRequestId,
        };
        travelRequestData.push(...data);
        await db.travel_request_data.create(data);
      }
    }
 
    const travel_id = travelRequest.id;
 
    const get_levels = await db.Work_Flow_range.findAll({
      where: {
        workflow_id: get_data.id,
        status: "ACTIVE",
      },
      attributes: ["level", "employee_id", "role_id", "workflow_id"],
    });
 
    const level_promises = get_levels.map(async (level) => {
      const created_level = await Travel_approval.create({
        level: level.level,
        employee_id: level.employee_id,
        workflow_id: level.workflow_id,
        travel_request_id: travel_id,
        role_id: level.role_id,
        department_id:user.department_id,
      });
 
      if (level.level == 1) {
        const employeeInfo = await db.user.findOne({
          where: {
            employee_id: level.employee_id,
          },
          attributes: ["employee_official_email", "first_name", "last_name"],
        });
 
        await sendDynamicMail(
          employeeInfo.employee_official_email,
          employeeInfo.first_name,
          employeeInfo.last_name,
          entity_id
        );
      }
      return created_level;
    });
 
    await Promise.all(level_promises);
 
    return res.status(200).send({
      code: 200,
      message: "Travel Request Created",
      data: { travelRequest, travelRequestData },
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};
 



/** Get all travel request data */
exports.get_all_travel_request = async (req, res) => {
  const { entity_id, user_id, role, financial_year_id } = req.body;

  try {
    let results;

    let baseQuery = `
            SELECT 
                tr.*,
                td.id AS data_id,
                td.include_hotel,
                td.number_of_days,
                td.travel_type,
                td.travel_to_date,
                td.travel_from_date,
                td.hotel_name,
                td.isDeleted AS data_isDeleted,
                td.createdAt AS data_createdAt,
                td.updatedAt AS data_updatedAt,
                td.travel_from_city_id,
                td.travel_to_city_id,
                td.travel_from_state_id,
                td.travel_to_state_id,
                td.travel_from_country_id,
                td.travel_to_country_id,
                td.domestic_travel_document,
                td.international_travel_document,
                fc.city_name AS travel_from_city_name,
                tc.city_name AS travel_to_city_name,
                fs.states_name AS travel_from_state_name,
                ts.states_name AS travel_to_state_name,
                fco.countryss_name AS travel_from_country_name,
                tco.countryss_name AS travel_to_country_name,
                ta.approvel_status,
                ta.level,
                ta.employee_id AS approval_employee_id,
                ta.department_id AS approval_department_id,
                u.first_name AS approval_first_name,
                u.last_name AS approval_last_name
            FROM
                ESS_TRAVEL_REQUEST AS tr
            LEFT JOIN 
                ESS_TRAVEL_REQUEST_DATA AS td ON tr.id = td.travel_request_id AND td.isDeleted = false
            LEFT JOIN 
                MASTER_CITY AS fc ON td.travel_from_city_id = fc.city_id
            LEFT JOIN 
                MASTER_CITY AS tc ON td.travel_to_city_id = tc.city_id
            LEFT JOIN 
                MASTER_STATE AS fs ON td.travel_from_state_id = fs.states_id
            LEFT JOIN 
                MASTER_STATE AS ts ON td.travel_to_state_id = ts.states_id
            LEFT JOIN 
                MASTER_COUNTRY AS fco ON td.travel_from_country_id = fco.countryss_id
            LEFT JOIN 
                MASTER_COUNTRY AS tco ON td.travel_to_country_id = tco.countryss_id
            LEFT JOIN 
                ESS_TRAVEL_APPROVEL_LEVEL AS ta ON ta.travel_request_id = tr.id
            LEFT JOIN 
                HRMS_REGISTERED_USER AS u ON u.employee_id = ta.employee_id
            WHERE 
                tr.isDeleted = false AND tr.entity_id = :entity_id AND tr.financial_year_id = :financial_year_id
        `;

    if (role !== "Super Admin") {
      baseQuery += ` AND tr.user_id = :user_id`;
    }

    baseQuery += ` ORDER BY tr.createdAt DESC`;

    if (role === "Super Admin") {
      results = await db.sequelize.query(baseQuery, {
        replacements: { entity_id, financial_year_id },
        type: db.sequelize.QueryTypes.SELECT,
      });
    } else {
      results = await db.sequelize.query(baseQuery, {
        replacements: { entity_id, user_id, financial_year_id },
        type: db.sequelize.QueryTypes.SELECT,
      });
    }

    if (results.length !== 0) {
      const travelRequests = results.reduce((acc, result) => {
        let existingRequest = acc.find((req) => req.id === result.id);
        if (!existingRequest) {
          existingRequest = {
            id: result.id,
            travel_request_number: result.travel_request_number,
            travel_name: result.travel_name,
            department: result.department,
            department_id: result.department_id,
            current_date: result.current_date,
            passport_number: result.passport_number,
            domestic_amount: result.domestic_amount,
            international_amount: result.international_amount,
            total_amount: result.total_amount,
            unforseen_event: result.unforseen_event,
            travel_remarks: result.travel_remarks,
            travel_document: result.travel_document,
            domestic_allowances: result.domestic_allowances,
            international_allowances: result.international_allowances,
            travel_request_status: result.travel_request_status,
            status: result.status,
            isDeleted: result.isDeleted,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            user_id: result.user_id,
            entity_id: result.entity_id,
            financial_year_id: result.financial_year_id,
            ESS_TRAVEL_REQUEST_DATA: [],
            travel_from_date: null,
            travel_to_date: null,
            approval_levels: [],
            cout_documents: false,
          };
          acc.push(existingRequest);
        }

        if (
          result.data_id &&
          !existingRequest.ESS_TRAVEL_REQUEST_DATA.some(
            (data) => data.id === result.data_id
          )
        ) {
          existingRequest.ESS_TRAVEL_REQUEST_DATA.push({
            id: result.data_id,
            include_hotel: result.include_hotel,
            number_of_days: result.number_of_days,
            travel_type: result.travel_type,
            travel_to_date: result.travel_to_date,
            travel_from_date: result.travel_from_date,
            hotel_name: result.hotel_name,
            isDeleted: result.data_isDeleted,
            createdAt: result.data_createdAt,
            updatedAt: result.updatedAt,
            travel_from_city_id: result.travel_from_city_id,
            travel_from_city_name: result.travel_from_city_name,
            travel_to_city_id: result.travel_to_city_id,
            travel_to_city_name: result.travel_to_city_name,
            travel_from_state_id: result.travel_from_state_id,
            travel_from_state_name: result.travel_from_state_name,
            travel_to_state_id: result.travel_to_state_id,
            travel_to_state_name: result.travel_to_state_name,
            travel_from_country_id: result.travel_from_country_id,
            travel_from_country_name: result.travel_from_country_name,
            travel_to_country_id: result.travel_to_country_id,
            travel_to_country_name: result.travel_to_country_name,
            domestic_travel_document: result.domestic_travel_document,
            international_travel_document: result.international_travel_document,
          });

          if (
            result.domestic_travel_document ||
            result.international_travel_document
          ) {
            existingRequest.cout_documents = true;
          }
        }

        if (
          result.approval_employee_id &&
          !existingRequest.approval_levels.some(
            (level) =>
              level.level === result.level &&
              level.employee_id === result.approval_employee_id
          )
        ) {
          existingRequest.approval_levels.push({
            level: result.level,
            name: `${result.approval_first_name} ${result.approval_last_name}`,
            status: result.approvel_status,
            employee_id: result.approval_employee_id,
            department_id: result.approval_department_id,
          });
        }

        return acc;
      }, []);

      travelRequests.forEach((request) => {
        const travelDataArray = request.ESS_TRAVEL_REQUEST_DATA;
        travelDataArray.sort(
          (a, b) => new Date(a.travel_from_date) - new Date(b.travel_to_date)
        );
        request.travel_from_date = travelDataArray[0]?.travel_from_date || null;
        request.travel_to_date =
          travelDataArray[travelDataArray.length - 1]?.travel_to_date || null;
      });

      return res.status(200).send({
        code: 200,
        message: "All Travel Requests",
        data: travelRequests,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Data Found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

/** Get travel data by id */
exports.get_travel_request_by_id = async (req, res) => {
  try {
    const travel_request_id = req.params.id;
    if (!travel_request_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Bad Request: Missing travel request ID" });
    } else {
      const query = `
            SELECT 
                tr.*,
                td.id AS data_id,
                td.include_hotel,
                td.number_of_days,
                td.travel_type,
                td.travel_to_date,
                td.travel_from_date,
                td.hotel_name,
                td.isDeleted AS data_isDeleted,
                td.createdAt AS data_createdAt,
                td.updatedAt AS data_updatedAt,
                td.travel_from_city_id,
                td.travel_to_city_id,
                td.travel_from_state_id,
                td.travel_to_state_id,
                td.travel_from_country_id,
                td.travel_to_country_id,
                fc.city_name AS travel_from_city_name,
                tc.city_name AS travel_to_city_name,
                fs.states_name AS travel_from_state_name,
                ts.states_name AS travel_to_state_name,
                fco.countryss_name AS travel_from_country_name,
                tco.countryss_name AS travel_to_country_name,
                tr.entity_id,
                tr.currency_id AS currency_id,
                tr.book_advance_status
            FROM 
                ESS_TRAVEL_REQUEST AS tr
            LEFT JOIN 
                ESS_TRAVEL_REQUEST_DATA AS td ON tr.id = td.travel_request_id AND td.isDeleted = false
            LEFT JOIN 
                MASTER_CITY AS fc ON td.travel_from_city_id = fc.city_id
            LEFT JOIN 
                MASTER_CITY AS tc ON td.travel_to_city_id = tc.city_id
            LEFT JOIN 
                MASTER_STATE AS fs ON td.travel_from_state_id = fs.states_id
            LEFT JOIN 
                MASTER_STATE AS ts ON td.travel_to_state_id = ts.states_id
            LEFT JOIN 
                MASTER_COUNTRY AS fco ON td.travel_from_country_id = fco.countryss_id
            LEFT JOIN 
                MASTER_COUNTRY AS tco ON td.travel_to_country_id = tco.countryss_id
            WHERE 
                tr.id = :travel_request_id AND tr.isDeleted = false;
        `;

      const results = await db.sequelize.query(query, {
        replacements: { travel_request_id },
        type: db.Sequelize.QueryTypes.SELECT,
      });

      if (results.length > 0) {
        const travelRequest = {
          id: results[0].id,
          travel_request_number: results[0].travel_request_number,
          travel_name: results[0].travel_name,
          department: results[0].department,
          current_date: results[0].current_date,
          passport_number: results[0].passport_number,
          domestic_amount: results[0].domestic_amount,
          international_amount: results[0].international_amount,
          total_amount: results[0].total_amount,
          unforseen_event: results[0].unforseen_event,
          travel_remarks: results[0].travel_remarks,
          travel_document: results[0].travel_document,
          domestic_allowances: results[0].domestic_allowances,
          international_allowances: results[0].international_allowances,
          travel_request_status: results[0].travel_request_status,
          status: results[0].status,
          isDeleted: results[0].isDeleted,
          createdAt: results[0].createdAt,
          updatedAt: results[0].updatedAt,
          user_id: results[0].user_id,
          entity_id: results[0].entity_id,
          financial_year_id: results[0].financial_year_id,
          currency_id: results[0].currency_id,
          book_advance_status: results[0].book_advance_status,
          ESS_TRAVEL_REQUEST_DATA: [],
        };

        // For each travel data, fetch journey bifurcation
        for (const result of results) {
          if (!result.data_id) continue;
          const journeyBifurcations = await db.sequelize.query(
            `SELECT id, from_date, travel_from_city_id, travel_to_city_id FROM ESS_TRAVEL_JOURNEY_BIFURCATION WHERE travel_data_id = :data_id`,
            {
              replacements: { data_id: result.data_id },
              type: db.Sequelize.QueryTypes.SELECT,
            }
          );
          travelRequest.ESS_TRAVEL_REQUEST_DATA.push({
            id: result.data_id,
            include_hotel: result.include_hotel,
            number_of_days: result.number_of_days,
            travel_type: result.travel_type,
            travel_to_date: result.travel_to_date,
            travel_from_date: result.travel_from_date,
            hotel_name: result.hotel_name,
            isDeleted: result.data_isDeleted,
            createdAt: result.data_createdAt,
            updatedAt: result.data_updatedAt,
            travel_from_city_id: result.travel_from_city_id,
            travel_from_city_name: result.travel_from_city_name,
            travel_to_city_id: result.travel_to_city_id,
            travel_to_city_name: result.travel_to_city_name,
            travel_from_state_id: result.travel_from_state_id,
            travel_from_state_name: result.travel_from_state_name,
            travel_to_state_id: result.travel_to_state_id,
            travel_to_state_name: result.travel_to_state_name,
            travel_from_country_id: result.travel_from_country_id,
            travel_from_country_name: result.travel_from_country_name,
            travel_to_country_id: result.travel_to_country_id,
            travel_to_country_name: result.travel_to_country_name,
            journeyBifurcation: journeyBifurcations,
          });
        }

        return res.status(200).send({
          code: 200,
          message: "Data fetched successfully",
          data: travelRequest,
        });
      } else {
        return res.status(404).send({ code: 404, message: "Not Found" });
      }
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

/** Delete travel request */
exports.delete_travel_request_by_id = async (req, res) => {
  try {
    const travel_request_id = req.params.id;

    const travel_request_data = await Travel_model.findOne({
      where: { id: travel_request_id, isDeleted: false },
    });

    if (travel_request_data) {
      await Travel_model.update(
        { isDeleted: true },
        {
          where: { id: travel_request_id },
        }
      );

      await Travel_data.update(
        { isDeleted: true },
        {
          where: { travel_request_id: travel_request_id },
        }
      );

      return res
        .status(200)
        .send({ code: 200, message: "Deleted successfully" });
    } else {
      return res.status(404).send({ code: 404, message: "Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

/** update travel request */
// Assumes `db`, `moment`, `logger`, `WorkFlow` etc are already in scope

// exports.update_travel_request = async (req, res) => {
//   const transaction = await db.sequelize.transaction();
//   try {
//     const {id,employee_id} = req.params;
//      const travel_id = id;
//     console.log(travel_id,employee_id,"id");
//     let {
//       Name,
//       Department,
//       current_date,
//       passport_number,
//       entity_id,
//       financial_year_id,
//       domesticLocations,
//       internationalLocations,
//       domesticAmount,
//       internationalAmount,
//       totalAmount,
//       unforeseenEvent,
//       remarks,
//       travel_document,
//       internationalAllowances,
//       domesticAllowances,
//       department_id,
//       currency_id,
//       book_advance_status,
//       expense_request_id,
//     } = req.body;

//     // normalize date
//     if (current_date) {
//       current_date = moment(current_date, "DD/MM/YYYY").format("YYYY-MM-DD");
//     }

//     // fetch existing travel_request within transaction
//     const travel_data = await db.travel_request.findOne({
//       where: { id: travel_id, isDeleted: false },
//       transaction,
//       lock: transaction.LOCK.UPDATE,
//     });

//     if (!travel_data) {
//       await transaction.rollback();
//       return res
//         .status(404)
//         .send({ code: 404, message: "Travel Data Not Found" });
//     }

//     // Update Travel Request master data (use transaction)
//     const [affectedRows] = await db.travel_request.update(
//       {
//         travel_name: Name,
//         department: Department,
//         current_date: current_date,
//         passport_number: passport_number,
//         entity_id: entity_id,
//         financial_year_id: financial_year_id,
//         domestic_amount: domesticAmount || 0,
//         international_amount: internationalAmount || 0,
//         total_amount: totalAmount,
//         unforseen_event: unforeseenEvent,
//         travel_remarks: remarks,
//         travel_document: travel_document,
//         domestic_allowances: domesticAllowances,
//         international_allowances: internationalAllowances,
//         department_id: department_id,
//         currency_id: currency_id,
//         book_advance_status: book_advance_status,
//       },
//       { where: { id: travel_id }, transaction }
//     );

//     // Remove old travel_request_data and related expense_request_data (inside transaction)
//     const oldTravelData = await db.travel_request_data.findAll({
//       where: { travel_request_id: travel_id },
//       attributes: ["id"],
//       transaction,
//     });

//     if (oldTravelData && oldTravelData.length > 0) {
//       const travelDataIds = oldTravelData.map((td) => td.id);

//       // Step 1: Nullify references in travel plan data
//       await db.ESS_TRAVEL_PLAN_DATA.update(
//         { tr_data_id: null, actual_city_id: null },
//         {
//           where: { tr_data_id: { [Op.in]: travelDataIds } },
//           transaction,
//         }
//       );
//       await db.expense_request_data.destroy({
//         where: { journey_id: { [Op.in]: travelDataIds } },
//         transaction,
//       });

//       await db.travel_request_data.destroy({
//         where: { travel_request_id: travel_id },
//         transaction,
//       });
//     }

//     const travelRequestData = [];
//     const finalExpenses = [];

//     // Re-insert Domestic locations + journey bifurcations (use transaction)
//     if (Array.isArray(domesticLocations) && domesticLocations.length > 0) {
//       for (const domesticLocation of domesticLocations) {
//         const data = {
//           include_hotel: domesticLocation.include_hotel || false,
//           number_of_days: domesticLocation.number_of_days || 0,
//           travel_type: "domestic",
//           travel_to_date: domesticLocation.domestic_to_date,
//           travel_from_date: domesticLocation.domestic_from_date,
//           hotel_name: domesticLocation.domestic_hotel_name || null,
//           travel_from_city_id: domesticLocation.domestic_from_city_id || null,
//           travel_to_city_id: domesticLocation.domestic_to_city_id || null,
//           travel_from_state_id: domesticLocation.domestic_from_state_id || null,
//           travel_to_state_id: domesticLocation.domestic_to_state_id || null,
//           travel_request_id: travel_id,
//         };

//         // create row within transaction and capture the created instance (trData)
//         const trData = await db.travel_request_data.create(data, {
//           transaction,
//         });
//         // push the created DB row (if you want created id etc) — previously you pushed raw 'data'
//         travelRequestData.push(trData);

//         const expenses = domesticLocation.expenses || [];
//         if (Array.isArray(expenses) && expenses.length > 0) {
//           for (let expense of expenses) {
//             expense.journey_id = trData.id;
//             // link to the expense_request if provided from top-level request
//             expense.expense_request_id = expense_request_id || null;
//             finalExpenses.push(expense);
//           }
//         }
//         const now = new Date(data.travel_from_date);
//         const year = now.getFullYear();
//         const month = now.getMonth() + 1; // 1-based
//         const fromDate = new Date(data.travel_from_date);
//         const toDate = new Date(data.travel_to_date);

//         // Step 1: Fetch travel plans for employee within the date range
//         const travelPlan = await db.ESS_TRAVEL_PLAN.findAll({
//           where: {
//             employee_id:employee_id,
//             name: `${month}/${year}`, // optional: keep if needed
//           },
//           include: [
//             {
//               model: db.ESS_TRAVEL_PLAN_DATA,
//               as: "plans",
//               attributes: ["id", "date", "plan_city_id", "actual_city_id"],
//               where: {
//                 date: {
//                   [Op.between]: [fromDate, toDate],
//                 },
//               },
//             },
//           ],
//           transaction,
//           lock: transaction.LOCK.UPDATE,
//         });

//         // Step 2: Update all fetched plan rows with tr_data_id
//         if (travelPlan && travelPlan.length > 0) {
//           for (const plan of travelPlan) {
//             if (plan.plans && plan.plans.length > 0) {
//               const planIds = plan.plans.map((p) => p.id);

//               await db.ESS_TRAVEL_PLAN_DATA.update(
//                 {
//                   tr_data_id: trData.id,
//                   actual_city_id: data.travel_to_city_id,
//                 },
//                 {
//                   where: { id: { [Op.in]: planIds } },
//                   transaction,
//                 }
//               );
//             }
//           }
//         }
//       }
//     }

//     // create/update expense requests — pass transaction. This function will return objects or throw.
//     if (Array.isArray(finalExpenses) && finalExpenses.length > 0) {
//       var { exp_request, createdExpenses } = await createExpenseRequests(
//         req,
//         finalExpenses,
//         travel_id,
//         transaction,
//         employee_id 
//       );
//     }

//     await transaction.commit();

//     return res.status(200).send({
//       code: 200,
//       message: "Travel Request Updated",
//       data: {
//         travelRequest: { affectedRows },
//         travelRequestData,
//         exp_request,
//         createdExpenses,
//       },
//     });
//   } catch (error) {
//     try {
//       if (transaction) await transaction.rollback();
//     } catch (rerr) {
//       logger.error("Rollback failed", { error: rerr });
//     }
//     logger.error(`Error ${error.message}`, { error });
//     console.error(error);
//     return res
//       .status(500)
//       .send({ code: 500, message: error.message || "Internal Server Error" });
//   }
// };


exports.update_travel_request = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id, employee_id } = req.params;
    const travel_id = id;
    console.log(travel_id, employee_id, "id");

    let {
      Name,
      Department,
      current_date,
      passport_number,
      entity_id,
      financial_year_id,
      domesticLocations,
      internationalLocations,
      domesticAmount,
      internationalAmount,
      totalAmount,
      unforeseenEvent,
      remarks,
      travel_document,
      internationalAllowances,
      domesticAllowances,
      department_id,
      currency_id,
      book_advance_status,
      expense_request_id,
    } = req.body;

    // normalize date
    if (current_date) {
      current_date = moment(current_date, "DD/MM/YYYY").format("YYYY-MM-DD");
    }

    // fetch existing travel_request within transaction
    const travel_data = await db.travel_request.findOne({
      where: { id: travel_id, isDeleted: false },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!travel_data) {
      await transaction.rollback();
      return res
        .status(404)
        .send({ code: 404, message: "Travel Data Not Found" });
    }

    // Update Travel Request master data
    const [affectedRows] = await db.travel_request.update(
      {
        travel_name: Name,
        department: Department,
        current_date: current_date,
        passport_number: passport_number,
        entity_id: entity_id,
        financial_year_id: financial_year_id,
        domestic_amount: domesticAmount || 0,
        international_amount: internationalAmount || 0,
        total_amount: totalAmount,
        unforseen_event: unforeseenEvent,
        travel_remarks: remarks,
        travel_document: travel_document,
        domestic_allowances: domesticAllowances,
        international_allowances: internationalAllowances,
        department_id: department_id,
        currency_id: currency_id,
        book_advance_status: book_advance_status,
      },
      { where: { id: travel_id }, transaction }
    );

    // Remove old travel_request_data and related expense_request_data
    const oldTravelData = await db.travel_request_data.findAll({
      where: { travel_request_id: travel_id },
      attributes: ["id"],
      transaction,
    });

    if (oldTravelData && oldTravelData.length > 0) {
      const travelDataIds = oldTravelData.map((td) => td.id);

      // Nullify references in travel plan data
      await db.ESS_TRAVEL_PLAN_DATA.update(
        { tr_data_id: null, actual_city_id: null },
        {
          where: { tr_data_id: { [Op.in]: travelDataIds } },
          transaction,
        }
      );

      await db.expense_request_data.destroy({
        where: { journey_id: { [Op.in]: travelDataIds } },
        transaction,
      });

      await db.travel_request_data.destroy({
        where: { travel_request_id: travel_id },
        transaction,
      });
    }

    const travelRequestData = [];
    const finalExpenses = [];

    // Re-insert Domestic locations + journey bifurcations
    if (Array.isArray(domesticLocations) && domesticLocations.length > 0) {
      for (const domesticLocation of domesticLocations) {
        const data = {
          include_hotel: domesticLocation.include_hotel || false,
          number_of_days: domesticLocation.number_of_days || 0,
          travel_type: "domestic",
          travel_to_date: domesticLocation.domestic_to_date,
          travel_from_date: domesticLocation.domestic_from_date,
          hotel_name: domesticLocation.domestic_hotel_name || null,
          travel_from_city_id: domesticLocation.domestic_from_city_id || null,
          travel_to_city_id: domesticLocation.domestic_to_city_id || null,
          travel_from_state_id: domesticLocation.domestic_from_state_id || null,
          travel_to_state_id: domesticLocation.domestic_to_state_id || null,
          travel_request_id: travel_id,
        };

        const trData = await db.travel_request_data.create(data, { transaction });
        travelRequestData.push(trData);

        const expenses = domesticLocation.expenses || [];
        if (Array.isArray(expenses) && expenses.length > 0) {
          for (let expense of expenses) {
            expense.journey_id = trData.id;
            expense.expense_request_id = expense_request_id || null;
            finalExpenses.push(expense);
          }
        }

        const now = new Date(data.travel_from_date);
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const fromDate = new Date(data.travel_from_date);
        const toDate = new Date(data.travel_to_date);

        // Fetch travel plans for employee within the date range
        const travelPlan = await db.ESS_TRAVEL_PLAN.findAll({
          where: {
            employee_id: employee_id,
            name: `${month}/${year}`,
          },
          include: [
            {
              model: db.ESS_TRAVEL_PLAN_DATA,
              as: "plans",
              attributes: ["id", "date", "plan_city_id", "actual_city_id"],
              where: {
                date: {
                  [Op.between]: [fromDate, toDate],
                },
              },
            },
          ],
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        // Update all fetched plan rows with tr_data_id
        if (travelPlan && travelPlan.length > 0) {
          for (const plan of travelPlan) {
            if (plan.plans && plan.plans.length > 0) {
              const planIds = plan.plans.map((p) => p.id);

              await db.ESS_TRAVEL_PLAN_DATA.update(
                {
                  tr_data_id: trData.id,
                  actual_city_id: data.travel_to_city_id,
                },
                {
                  where: { id: { [Op.in]: planIds } },
                  transaction,
                }
              );
            }
          }
        }
      }
    }

    // create/update expense requests
    if (Array.isArray(finalExpenses) && finalExpenses.length > 0) {
      var { exp_request, createdExpenses } = await createExpenseRequests(
        req,
        finalExpenses,
        travel_id,
        transaction,
        employee_id
      );
    }

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: "Travel Request Updated",
      data: {
        travelRequest: { affectedRows },
        travelRequestData,
        exp_request,
        createdExpenses,
      },
    });
  } catch (error) {
    try {
      if (transaction) await transaction.rollback();
    } catch (rerr) {
      logger.error("Rollback failed", { error: rerr });
    }
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};



/**
 * createExpenseRequests
 *
 * NOTE: This helper no longer uses res to send responses. It throws Errors (so the caller can decide response).
 * Caller must pass a valid Sequelize `transaction` if they want changes inside a transaction.
 */
async function createExpenseRequests(
  req,
  expenses = [],
  travel_id,
  transaction = null,
  employee_id 
) {
  try {
    // Pull values needed from req.body / req.user
    const {
      entity_id,
      financial_year_id,
      expense_request_type,
      isValidToSubmit,
      isValidToApprove,
      current_date,
      travel_from_city_id,
      travel_to_city_id,
      advance_amt,
      department_id
    } = req.body;

    // const employee_id = employee_id;
    // const department_id = department_id;

    if (expense_request_type === "Indirect_Expense") {
      // === Get Department Info ===
      if (!department_id) {
        throw new Error("Department not found for the employee!");
      }

      // Get workflow for department
      const get_data = await WorkFlow.findOne({
        where: {
          department_id: department_id,
          entity_id: entity_id,
          job_name: "Travel Expense",
          status: "ACTIVE",
        },
        attributes: ["id"],
        transaction,
      });

      if (!get_data) {
        await transaction.rollback();
        throw new Error("Workflow is not created for required department!");
      }

      // === Get Workflow ===
      const workflow = await WorkFlow.findOne({
        where: {
          department_id,
          entity_id,
          job_name: "Travel Expense",
          status: "ACTIVE",
        },
        attributes: ["id"],
        transaction,
      });

      if (!workflow) {
        throw new Error("Workflow is not created for the required department!");
      }
      const existingRequest = await db.expense_request.findOne({
        where: { travel_request_id: travel_id },
        transaction,
      });

      // === CASE 1: Update Existing ===
      if (existingRequest && existingRequest.id) {
        if (!existingRequest) {
          throw new Error("Expense request not found!");
        }

        // Handle status transition (DRAFT -> SUBMIT/APPROVE)
        if (
          existingRequest.expense_final_status === "DRAFT" &&
          isValidToSubmit
        ) {
          if (expenses.length === 0) {
            throw new Error("There is not any valid Expenses for Approval");
          }

          existingRequest.expense_final_status = isValidToApprove
            ? "APPROVED"
            : "PENDING";

          if (isValidToApprove) {
            // create or update expense_approval
            const [approval, created] = await db.expense_approval.findOrCreate({
              where: { employee_id, expense_request_id: existingRequest.id },
              defaults: {
                level: 1,
                workflow_id: workflow.id,
                role_id: null,
                department_id,
                expense_approvel_status: isValidToApprove
                  ? "APPROVED"
                  : "PENDING",
                expense_approval_remarks: isValidToApprove
                  ? "Default Auto Approve"
                  : null,
              },
              transaction,
            });

            if (!created) {
              await approval.update(
                {
                  expense_approvel_status: isValidToApprove
                    ? "APPROVED"
                    : "PENDING",
                  expense_approval_remarks: isValidToApprove
                    ? "Default Approve"
                    : null,
                },
                { transaction }
              );
            }
          }
          // persist the updated expense_final_status
          await existingRequest.save({ transaction });
        }

        // Update common fields
        const updatedFields = {
          entity_id: parseInt(entity_id),
          financial_year_id: parseInt(financial_year_id),
          department_id: department_id,
          employee_id: employee_id,
          travel_request_id: parseInt(travel_id) || null,
          expense_request_type,
          advance_amount: advance_amt || null,
          expense_final_status: existingRequest.expense_final_status,
          travel_from_city_id: travel_from_city_id || null,
          travel_to_city_id: travel_to_city_id || null,
          current_date: current_date || null,
        };

        await existingRequest.update(updatedFields, { transaction });
        exp_request = existingRequest;

        // Clear old request data
        await db.expense_request_data.destroy({
          where: { expense_request_id: existingRequest.id },
          transaction,
        });
      } else {
        // === CASE 2: Create New ===
        const latestExpense = await db.expense_request.findOne({
          where: { entity_id },
          order: [["createdAt", "DESC"]],
          transaction,
        });

        const serial = latestExpense?.expense_request_number?.replace(
          "EXP",
          ""
        );
        const serial_number = /^\d+$/.test(serial)
          ? parseInt(serial, 10) + 1
          : 1;

        exp_request = await db.expense_request.create(
          {
            expense_request_number: "EXP" + serial_number,
            entity_id,
            department_id,
            employee_id,
            financial_year_id,
            current_date: current_date || null,
            travel_request_id: travel_id || null,
            travel_from_city_id: travel_from_city_id || null,
            travel_to_city_id: travel_to_city_id || null,
            advance_amount: advance_amt || null,
            expense_request_type,
            expense_final_status: isValidToSubmit
              ? isValidToApprove
                ? "APPROVED"
                : "PENDING"
              : "DRAFT",
          },
          { transaction }
        );

        const expense_id = exp_request.id;

        const get_levels = await db.Work_Flow_range.findAll({
          where: {
            workflow_id: get_data.id,
            status: "ACTIVE",
          },
          attributes: ["level", "employee_id", "role_id", "workflow_id"],
          transaction,
        });

        const level_promises = get_levels.map(async (level) => {
          return await db.expense_approval.create(
            {
              level: level.level,
              employee_id: level.employee_id,
              workflow_id: level.workflow_id,
              expense_request_id: expense_id,
              role_id: level.role_id,
              department_id: department_id,
              expense_approvel_status: isValidToApprove
                ? "APPROVED"
                : "PENDING",
              expense_approval_remarks: isValidToApprove
                ? "Default Auto Approve"
                : null,
            },
            { transaction }
          );
        });

        await Promise.all(level_promises);
      }

      // === Add Expense Request Data ===
      const createdExpenses = [];
      if (Array.isArray(expenses) && expenses.length > 0) {
        for (const expense of expenses) {
          const baseData = {
            expense_request_id: exp_request.id,
            exp_category_id: expense.exp_category_id,
            expense_date: expense.expense_date,
            expense_remarks: expense.remarks || null,
            expense_document: expense.documents || null,
            exp_amount: expense.exp_amount,
            expense_name: expense.exp_name || null,
            bill_no: expense.bill_no || null,
            journey_id: expense.journey_id || null,
          };

          const created = await db.expense_request_data.create(baseData, {
            transaction,
          });
          createdExpenses.push(created);
        }
      }

      return { exp_request, createdExpenses };
    }

    // If not Indirect_Expense, just return empty result
    return { exp_request: null, createdExpenses: [] };
  } catch (error) {
    // Bubble up error to caller (caller will rollback & respond)
    throw error;
  }
}

/** get levels to be approved data */
exports.get_levels_to_be_approved = async (req, res) => {
  try {
    const user_id = req.params.id;
    const entity_id = req.params.entity_id;
    const query = `
            SELECT 
                tr.id,
                tr.level,
                tr.travel_request_id,
                tr.approvel_status,
                tr.status,
                tr.employee_id,
                tr.workflow_id,
                tr.role_id,
                tr.department_id,
                td.entity_id AS entity_id,
                td.travel_request_number,
                aggregated_data.travel_from_date,
                aggregated_data.travel_to_date,
                tr.isDeleted,
                tr.createdAt,
                tr.updatedAt,
                fc.first_name,
                fc.last_name
            FROM 
                ESS_TRAVEL_APPROVEL_LEVEL AS tr
            LEFT JOIN 
                ESS_TRAVEL_REQUEST AS td ON tr.travel_request_id = td.id AND td.isDeleted = false
            LEFT JOIN (
                SELECT 
                    travel_request_id,
                    MIN(travel_from_date) AS travel_from_date,
                    MAX(travel_to_date) AS travel_to_date
                FROM 
                    ESS_TRAVEL_REQUEST_DATA
                WHERE 
                    isDeleted = false
                GROUP BY 
                    travel_request_id
            ) AS aggregated_data ON tr.travel_request_id = aggregated_data.travel_request_id
            LEFT JOIN 
                HRMS_REGISTERED_USER AS fc ON td.user_id = fc.employee_id
            LEFT JOIN 
                MASTER_DEPARTMENT AS tc ON tc.dept_id = tr.department_id
            WHERE 
                tr.employee_id = ${user_id} 
                AND td.entity_id = ${entity_id}

                AND tr.status = 'ACTIVE'
                AND tr.approvel_status = 'PENDING'
                AND NOT EXISTS (
                    SELECT 1
                    FROM ESS_TRAVEL_APPROVEL_LEVEL AS prev
                    WHERE prev.travel_request_id = tr.travel_request_id 
                    AND prev.level < tr.level
                    AND prev.approvel_status != 'APPROVED'
                )
                    ORDER BY aggregated_data.travel_from_date DESC, tr.createdAt DESC;
        `;

    const get_all_data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (get_all_data.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Travel Data Successfully",
        data: get_all_data,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Record Not Found!",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

/** Get Rejected Approvals */
exports.get_Travel_Rejected_Approvals = async (req, res) => {
  try {
    const user_id = req.params.id;
    const entity_id = req.params.entity_id;

    const query = `
        WITH CTE AS (
            SELECT 
                tr.id AS id,
                tr.level AS level,
                tr.approvel_status AS approvel_status,
                tr.status AS status,
                tr.isDeleted AS isDeleted,
                tr.createdAt AS createdAt,
                tr.updatedAt AS updatedAt,
                tr.employee_id AS employee_id,
                tr.workflow_id AS workflow_id,
                tr.travel_request_id AS travel_request_id,
                tr.role_id AS role_id,
                tr.department_id AS department_id,
                fc.first_name AS first_name,
                fc.last_name AS last_name,
                td.entity_id AS entity_id,
                td.travel_request_number AS travel_request_number,
                tds.travel_from_date AS travel_from_date,
                tds.travel_to_date AS travel_to_date,
                ROW_NUMBER() OVER (PARTITION BY td.travel_request_number ORDER BY tr.id) as row_num
            FROM 
                ESS_TRAVEL_APPROVEL_LEVEL AS tr
            LEFT JOIN 
                ESS_TRAVEL_REQUEST AS td ON tr.travel_request_id = td.id AND td.isDeleted = false
            LEFT JOIN 
                HRMS_REGISTERED_USER AS fc ON td.user_id = fc.employee_id
            LEFT JOIN 
                MASTER_DEPARTMENT AS tc ON tc.dept_id = tr.department_id
            LEFT JOIN 
                ESS_TRAVEL_REQUEST_DATA AS tds ON tr.travel_request_id = tds.travel_request_id AND tds.isDeleted = false    
            WHERE 
                tr.employee_id = ${user_id}
                AND td.entity_id = ${entity_id}
                AND tr.status = 'ACTIVE'
                AND tr.approvel_status = 'REJECTED'
        )
        SELECT * FROM CTE
        WHERE row_num = 1
        ORDER BY createdAt DESC
        `;

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData && getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All data Successfully",
        data: getAllData,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/** Get Travel Approval Level */
exports.get_Travel_Approved_Approvals = async (req, res) => {
  try {
    const user_id = req.params.id;
    const entity_id = req.params.entity_id;

    const query = `
        WITH CTE AS (
            SELECT 
                tr.id AS id,
                tr.level AS level,
                tr.approvel_status AS approvel_status,
                tr.status AS status,
                tr.isDeleted AS isDeleted,
                tr.createdAt AS createdAt,
                tr.updatedAt AS updatedAt,
                tr.employee_id AS employee_id,
                tr.workflow_id AS workflow_id,
                tr.travel_request_id AS travel_request_id,
                tr.role_id AS role_id,
                tr.department_id AS department_id,
                fc.first_name AS first_name,
                fc.last_name AS last_name,
                td.entity_id AS entity_id,
                td.travel_request_number AS travel_request_number,
                tds.travel_from_date AS travel_from_date,
                tds.travel_to_date AS travel_to_date,
                ROW_NUMBER() OVER (PARTITION BY td.travel_request_number ORDER BY tr.id) as row_num
            FROM 
                ESS_TRAVEL_APPROVEL_LEVEL AS tr
            LEFT JOIN 
                ESS_TRAVEL_REQUEST AS td ON tr.travel_request_id = td.id AND td.isDeleted = false
            LEFT JOIN 
                HRMS_REGISTERED_USER AS fc ON td.user_id = fc.employee_id
            LEFT JOIN 
                MASTER_DEPARTMENT AS tc ON tc.dept_id = tr.department_id
            LEFT JOIN 
                ESS_TRAVEL_REQUEST_DATA AS tds ON tr.travel_request_id = tds.travel_request_id AND tds.isDeleted = false    
            WHERE 
                tr.employee_id = ${user_id}
                AND td.entity_id = ${entity_id}
                AND tr.status = 'ACTIVE'
                AND tr.approvel_status = 'APPROVED'
        )
        SELECT * FROM CTE
        WHERE row_num = 1
        ORDER BY createdAt DESC
        `;

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Approved Approvals Successfully !",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Approved Approvals Found for This Employee !",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

/** Update travel level status*/
exports.travel_approve_levels = async (req, res) => {
  try {
    const travel_id = req.params.travel_id;
    const { approvel_status, employee_id, remarks } = req.body;

    const allLevelsData = await db.travel_approval.findAll({
      where: { employee_id, travel_request_id: travel_id },
      order: [["level", "ASC"]],
    });
    if (!allLevelsData || allLevelsData.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No Level has been Assigned to this Employee!",
      });
    }

    const currentLevelData = await db.travel_approval.findOne({
      attributes: ["level"],
      where: { employee_id: employee_id, travel_request_id: travel_id },
    });

    const currentLevelValue = currentLevelData?.level;

    if (!currentLevelValue) {
      return res.status(404).send({
        code: 404,
        message: "Current level not found for the given employee",
      });
    }

    if (approvel_status === "REJECTED") {
      await db.travel_request.update(
        { travel_request_status: "REJECTED" },
        { where: { id: travel_id } }
      );

      await db.travel_approval.update(
        { travel_approval_remarks: remarks, approvel_status: "REJECTED" },
        { where: { employee_id, travel_request_id: travel_id } }
      );

      return res.status(200).send({
        code: 200,
        message: "Travel Request Rejected Successfully!",
      });
    }

    if (approvel_status === "APPROVED") {
      const maxLevel = await db.travel_approval.max("level", {
        where: { travel_request_id: travel_id },
      });

      if (currentLevelValue == maxLevel) {
        await db.travel_request.update(
          { travel_request_status: "APPROVED" },
          { where: { id: travel_id } }
        );

        await db.travel_approval.update(
          { travel_approval_remarks: remarks, approvel_status },
          { where: { employee_id, travel_request_id: travel_id } }
        );
      } else {
        await db.travel_approval.update(
          { travel_approval_remarks: remarks, approvel_status },
          { where: { employee_id, travel_request_id: travel_id } }
        );
      }

      if (currentLevelValue !== maxLevel) {
        const nextLevel = currentLevelValue + 1;

        const nextLevelEmp = await db.travel_approval.findOne({
          attributes: ["employee_id"],
          where: {
            level: nextLevel,
            travel_request_id: travel_id,
          },
        });

        if (nextLevelEmp?.employee_id) {
          const employeeInfo = await db.user.findOne({
            where: { employee_id: nextLevelEmp.employee_id },
            attributes: ["employee_official_email", "first_name", "last_name"],
          });

          const employee_entity = await db.user_entity.findOne({
            where: { employee_id: nextLevelEmp.employee_id },
            attributes: ["entity_id", "entity_name"],
          });

          if (employeeInfo && employee_entity) {
            await sendDynamicMail(
              employeeInfo.employee_official_email,
              employeeInfo.first_name,
              employeeInfo.last_name,
              employee_entity.entity_id
            );
          }
        }
      }
      return res
        .status(200)
        .send({ code: 200, message: "Travel Request Updated Successfully!" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

/** Get Travel Level */
exports.All_Travel_Approval_level = async (req, res) => {
  try {
    const travel_id = req.params.travel_id;
    const { department_id, employeeId } = req.body;

    const getData = await db.travel_approval.findAll({
      where: {
        travel_request_id: travel_id,
      },
      attributes: [
        "approvel_status",
        "level",
        "employee_id",
        "department_id",
        "travel_approval_remarks",
      ],
    });

    if (!getData || getData.length === 0) {
      return res.status(400).send({ code: 400, message: "Data not found" });
    }

    if (department_id && employeeId) {
      getData.employee_id = employeeId;
      getData.department_id = department_id;
    }
    const levelsWithNames = [];
    for (const levelInfo of getData) {
      const employeeInfo = await db.user.findOne({
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
        status: levelInfo.approvel_status,
        remarks: levelInfo.travel_approval_remarks,
      };
      levelsWithNames.push(levelWithName);
    }

    levelsWithNames.sort((a, b) => a.level - b.level);

    return res.status(200).send({
      code: 200,
      message: "Data Fetched Successfully!",
      data: levelsWithNames,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/** get all advance approved travel request  */
exports.getAllAdvanceTravelData = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.body;

    const travel_data_array = await Travel_model.findAll({
      where: { entity_id: entity_id, financial_year_id: financial_year_id },
      attributes: [
        "travel_request_number",
        "current_date",
        "id",
        "user_id",
        "book_advance_status",
        "travel_request_status",
      ],
    });

    let resultArray = [];

    for (const travel_data of travel_data_array) {
      if (
        travel_data.book_advance_status === true &&
        travel_data.travel_request_status === "APPROVED"
      ) {
        const trv_data_array = await Travel_data.findAll({
          where: { travel_request_id: travel_data.id },
          order: [["createdAt", "ASC"]],
        });

        const first_trv_data = trv_data_array[0];
        const last_trv_data = trv_data_array[trv_data_array.length - 1];

        const user_data = await User_Model.findOne({
          where: { employee_id: parseInt(travel_data.user_id) },
          attributes: ["first_name", "last_name"],
        });

        resultArray.push({
          travel_id: travel_data.id,
          travel_request_number: travel_data.travel_request_number,
          travel_from_date: first_trv_data.travel_from_date,
          travel_to_date: last_trv_data.travel_to_date,
          Name: `${user_data.first_name} ${user_data.last_name}`,
        });
      }
    }

    return res.status(200).send({
      code: 200,
      message: "Data Fetched successfully",
      data: resultArray,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/** download ticket */
const getFileContent = async (filename) => {
  try {
    const fileUrl = `https://eliteerp.elitetraveltech.in/uploaded_files/${filename}`;

    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const base64Content = Buffer.from(response.data).toString("base64");

    return base64Content;
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(`Error fetching file content for ${filename}:`, error);
    return null;
  }
};

exports.downloadUploadTicket = async (req, res) => {
  try {
    const travel_id = req.params.travel_id;

    const travelRequests = await Travel_data.findAll({
      where: { travel_request_id: travel_id },
    });
    if (travelRequests.length === 0) {
      return res.status(404).json({ message: "Travel request not found" });
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    let filesAdded = false;

    const appendFilesToArchive = async (documents, folder) => {
      for (const doc of documents) {
        const [key, filename] = Object.entries(doc)[0];
        if (filename) {
          try {
            const content = await getFileContent(filename);
            if (content) {
              console.log(`Appending file: ${filename}`);
              archive.append(Buffer.from(content, "base64"), {
                name: `${folder}/${filename}`,
              });
              filesAdded = true;
            } else {
              console.log(`No content found for file: ${filename}`);
            }
          } catch (err) {
            console.log(`Error retrieving content for file: ${filename}`, err);
          }
        } else {
          console.log(
            `Filename is missing for a document in folder: ${folder}`
          );
        }
      }
    };

    for (const travelData of travelRequests) {
      const { domestic_travel_document, international_travel_document } =
        travelData.dataValues;

      if (domestic_travel_document) {
        await appendFilesToArchive(domestic_travel_document, "domestic");
      } else {
        console.log("No domestic travel documents found.");
      }

      if (international_travel_document) {
        await appendFilesToArchive(
          international_travel_document,
          "international"
        );
      } else {
        console.log("No international travel documents found.");
      }
    }

    if (!filesAdded) {
      return res
        .status(404)
        .json({ message: "No documents found for the travel request" });
    }

    res.attachment(`travel_documents_${travel_id}.zip`);
    archive.pipe(res);
    archive.finalize();
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getTravelReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, department_id, employee_id, status } =
      req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
                    SELECT 
                        TR.id,
                        TR.user_id,
                        CONCAT(HR.first_name, ' ', HR.last_name) AS travel_name,
                        HR.employee_code,
                        TR.department,
                        TR.department_id,
                        TR.travel_request_number,
                        (
                            SELECT CONCAT(MCI.city_name, ', ', MS.states_name, ', ', MC.countryss_name) 
                            FROM ESS_TRAVEL_REQUEST_DATA TRD
                            LEFT JOIN MASTER_COUNTRY MC ON MC.countryss_id = TRD.travel_to_country_id
                            LEFT JOIN MASTER_CITY MCI ON MCI.city_id = TRD.travel_to_city_id
                            LEFT JOIN MASTER_STATE MS ON MS.states_id = TRD.travel_to_state_id
                            WHERE TRD.travel_request_id = TR.id
                            ORDER BY TRD.travel_to_date DESC 
                            LIMIT 1
                        ) AS last_destination,
                        DATE_FORMAT(MIN(TRD.travel_from_date), '%Y-%m-%d') AS travel_from_date,
                        DATE_FORMAT(MAX(TRD.travel_to_date), '%Y-%m-%d') AS travel_to_date,
                        TR.travel_remarks,
                        TR.total_amount,
                        TR.travel_request_status,
                        TAL.employee_id AS approver_id,
                        CONCAT(HR.first_name, ' ', HR.last_name) AS approver_name
                    FROM ESS_TRAVEL_REQUEST AS TR
                    LEFT JOIN ESS_TRAVEL_APPROVEL_LEVEL TAL ON TAL.travel_request_id = TR.id
                    LEFT JOIN HRMS_REGISTERED_USER HR ON HR.employee_id = TR.user_id
                    LEFT JOIN ESS_TRAVEL_REQUEST_DATA TRD ON TRD.travel_request_id = TR.id
                    WHERE TR.entity_id = :entity_id
                    AND TR.isDeleted = 0
        `;

    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(TRD.travel_from_date) = :month_id`;
      replacements.month_id = month_id;
    }
    if (financial_year_id) {
      query += ` AND YEAR(TRD.travel_from_date) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }
    if (department_id) {
      query += ` AND TR.department_id = :department_id`;
      replacements.department_id = department_id;
    }
    if (employee_id) {
      query += ` AND TR.user_id = :employee_id`;
      replacements.employee_id = employee_id;
    }
    if (status) {
      query += ` AND TR.travel_request_status = :status`;
      replacements.status = status;
    }

    query += `
                GROUP BY 
                    TR.id, TR.user_id, HR.first_name, HR.last_name, HR.employee_code, TR.department, 
                    TR.department_id, TR.travel_request_number, TR.travel_remarks, TR.total_amount, 
                    TR.travel_request_status, TAL.employee_id
                ORDER BY TR.id DESC;
        `;

    const onboardingReport = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!onboardingReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Travel report fetched successfully.",
      data: onboardingReport,
    });
  } catch (error) {
    console.error("Error fetching travel report:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getExpenceSummaryReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const {
      month_id,
      financial_year_id,
      department_id,
      employee_id,
      status,
      exp_category_id,
    } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
            SELECT
                ER.id,
                ER.expense_request_number,
                ER.employee_id,
                CONCAT(HR.first_name,' ',HR.last_name) as employee_name,
                ER.department_id,
                MD.department_name,
                ER.expense_request_type,
                ERD.expense_date,
                ERD.exp_amount,
                ER.advance_amount,
                ER.expense_final_status,
                ERD.exp_category_id,
                ERD.exp_amount,
                ME.expense_type
            FROM
                EXPENSE_REQUEST ER
                LEFT JOIN EXPENSE_REQUEST_DATA ERD ON ERD.expense_request_id = ER.id
                LEFT JOIN HRMS_REGISTERED_USER HR ON HR.employee_id = ER.employee_id
                LEFT JOIN MASTER_DEPARTMENT MD ON MD.dept_id = ER.department_id
                LEFT JOIN MASTER_EXPENSE ME ON ME.id = ERD.exp_category_id
            WHERE
                ER.isDeleted = 0
                AND ER.entity_id = :entity_id
        `;

    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(ERD.expense_date) = :month_id`;
      replacements.month_id = month_id;
    }
    if (financial_year_id) {
      query += ` AND YEAR(ERD.expense_date) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }
    if (department_id) {
      query += ` AND ER.department_id = :department_id`;
      replacements.department_id = department_id;
    }
    if (employee_id) {
      query += ` AND ER.employee_id = :employee_id`;
      replacements.employee_id = employee_id;
    }
    if (status) {
      query += ` AND ER.expense_final_status = :status`;
      replacements.status = status;
    }
    if (exp_category_id) {
      query += ` AND ERD.exp_category_id = :exp_category_id`;
      replacements.exp_category_id = exp_category_id;
    }
    query += ` ORDER BY ER.id DESC;`;
    const onboardingReport = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!onboardingReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Expence Summary report fetched successfully.",
      data: onboardingReport,
    });
  } catch (error) {
    console.error("Error fetching Expence Summary report:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getTravelExpenceReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const {
      month_id,
      financial_year_id,
      department_id,
      employee_id,
      status,
      exp_category_id,
    } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
            SELECT
                TR.id AS travel_request_id,
                TR.user_id,
                HR.employee_code,
                CONCAT(HR.first_name, ' ', HR.last_name) AS employee_name,
                HR.designation_id,
                DN.designation_name,
                CONCAT(
                    COALESCE(MAX(MCI.city_name), 'N/A'),
                    ', ',
                    COALESCE(MAX(MS.states_name), 'N/A'),
                    ', ',
                    COALESCE(MAX(MC.countryss_name), 'N/A')
                ) AS last_destination,
                CONCAT(
                    DATE_FORMAT(MIN(TRD.travel_from_date), '%Y-%m-%d'),
                    ' to ',
                    DATE_FORMAT(MAX(TRD.travel_to_date), '%Y-%m-%d')
                ) AS travel_dates,
                COALESCE(TAB.total_amount, 0) AS claimed_amount,
                COALESCE(ER.advance_amount, 0) AS approved_amount,
                (COALESCE(ER.advance_amount, 0) - COALESCE(TAB.total_amount, 0)) AS pending_reimbursement_amount,
                TR.travel_remarks,
                GROUP_CONCAT(DISTINCT ERD.exp_category_id) AS expense_category,
                GROUP_CONCAT(DISTINCT ME.expense_type) AS expense_type
            FROM ESS_TRAVEL_REQUEST TR
            LEFT JOIN HRMS_REGISTERED_USER HR ON HR.employee_id = TR.user_id
            LEFT JOIN DESIGNATION DN ON DN.designation_id = HR.designation_id
            LEFT JOIN ESS_TRAVEL_REQUEST_DATA TRD ON TRD.travel_request_id = TR.id 
            LEFT JOIN EXPENSE_REQUEST ER ON ER.travel_request_id = TR.id 
            LEFT JOIN EXPENSE_REQUEST_DATA ERD ON ERD.expense_request_id = ER.id
            LEFT JOIN MASTER_COUNTRY MC ON MC.countryss_id = TRD.travel_to_country_id
            LEFT JOIN MASTER_CITY MCI ON MCI.city_id = TRD.travel_to_city_id
            LEFT JOIN MASTER_STATE MS ON MS.states_id = TRD.travel_to_state_id
            LEFT JOIN MASTER_EXPENSE ME ON ME.id = ERD.exp_category_id
            LEFT JOIN FINANCE_TRAVEL_ADVANCE_BOOKING TAB ON TAB.travel_request_id = TR.id
            WHERE TR.entity_id = :entity_id AND TR.isDeleted = 0
        `;

    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(TRD.travel_from_date) = :month_id`;
      replacements.month_id = month_id;
    }
    if (financial_year_id) {
      query += ` AND YEAR(TRD.travel_from_date) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }
    if (department_id) {
      query += ` AND HR.department_id = :department_id`;
      replacements.department_id = department_id;
    }
    if (employee_id) {
      query += ` AND TR.user_id = :employee_id`;
      replacements.employee_id = employee_id;
    }
    if (status) {
      query += ` AND TR.travel_request_status = :status`;
      replacements.status = status;
    }
    if (exp_category_id) {
      query += ` AND ERD.exp_category_id = :exp_category_id`;
      replacements.exp_category_id = exp_category_id;
    }
    query += `
            GROUP BY 
                TR.id, TR.user_id, HR.employee_code, HR.first_name, HR.last_name, 
                HR.designation_id, DN.designation_name, TR.travel_remarks, 
                ER.advance_amount, TAB.total_amount
            ORDER BY TR.id DESC;
        `;

    const travelReport = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!travelReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Expense Summary report fetched successfully.",
      data: travelReport,
    });
  } catch (error) {
    console.error("Error fetching Expense Summary report:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getDepartmentTravelExpenceReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, department_id } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
                SELECT
                    tr.department_id,
                    tr.department,
                    COUNT(tr.id) AS total_travel_requests,
                    COUNT(
                        CASE WHEN tr.travel_request_status = 'APPROVED' THEN 1 END
                    ) AS approved_travel_requests,
                    SUM(
                        CASE WHEN ER.expense_final_status = 'APPROVED' AND ER.department_id = tr.department_id THEN ER.advance_amount ELSE 0 END
                    ) AS total_approved_expense_amount,
                    SUM(
                        CASE WHEN ER.expense_final_status = 'PENDING' AND ER.department_id = tr.department_id THEN ER.advance_amount ELSE 0 END
                    ) AS total_pending_expense_amount
                FROM
                    ESS_TRAVEL_REQUEST tr
                    LEFT JOIN EXPENSE_REQUEST ER 
                        ON ER.travel_request_id = tr.id
                        AND ER.department_id = tr.department_id
                WHERE
                    tr.entity_id = :entity_id
                    AND tr.isDeleted = 0
        `;

    const replacements = { entity_id };

    if (financial_year_id) {
      query += ` AND tr.financial_year_id = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }
    if (department_id) {
      query += ` AND tr.department_id = :department_id`;
      replacements.department_id = department_id;
    }

    query += ` GROUP BY tr.department_id, tr.department
                   ORDER BY total_travel_requests DESC;`;

    const onboardingReport = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!onboardingReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Expense Summary report fetched successfully.",
      data: onboardingReport,
    });
  } catch (error) {
    console.error("Error fetching Expense Summary report:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getTopSpendingEmployees = async (req, res) => {
  try {
    const { entity_id, department_id } = req.params;

    if (!department_id || !entity_id) {
      return res.status(400).json({
        code: 400,
        message: "Department id and Entity id is required!",
      });
    }

    let query = `
                    SELECT
                        Er.employee_id,
                        CONCAT(hr.first_name,' ',hr.last_name) AS employee_name,
                        SUM(Er.advance_amount) AS total_advance_amount
                    FROM
                        EXPENSE_REQUEST Er
                        LEFT JOIN HRMS_REGISTERED_USER hr ON hr.employee_id = Er.employee_id
                    WHERE
                        Er.isDeleted = 0
                        AND Er.department_id = :department_id
                        AND Er.entity_id = :entity_id
                    GROUP BY
                        Er.employee_id
                    ORDER BY
                        total_advance_amount DESC;`;
    const topSpendingEmployees = await db.sequelize.query(query, {
      replacements: { department_id: department_id, entity_id: entity_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!topSpendingEmployees.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Top spending employees fetched succesfully.",
      data: topSpendingEmployees,
    });
  } catch (error) {
    console.error("Error fetching most frequent destinations:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getFrequentlyVisitedCities = async (req, res) => {
  try {
    const { department_id } = req.params;

    if (!department_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Department ID is required." });
    }

    let query = `
                WITH DepartmentCityVisits AS (
                    SELECT
                        tr.department_id,
                        tr.department,
                        TRD.travel_to_city_id,
                        MC.city_name,
                        COUNT(TRD.travel_to_city_id) AS city_visit_count
                    FROM
                        ESS_TRAVEL_REQUEST tr
                        LEFT JOIN ESS_TRAVEL_REQUEST_DATA TRD ON TRD.travel_request_id = tr.id
                        LEFT JOIN MASTER_CITY MC ON MC.city_id = TRD.travel_to_city_id
                    WHERE
                        tr.entity_id = 1
                        AND tr.isDeleted = 0
                    GROUP BY
                        tr.department_id,
                        tr.department,
                        TRD.travel_to_city_id,
                        MC.city_name 
                )
                SELECT
                    department_id,
                    department,
                    travel_to_city_id,
                    city_name,
                    city_visit_count,
                    RANK() OVER (PARTITION BY department_id ORDER BY city_visit_count DESC) AS city_rank
                FROM
                    DepartmentCityVisits
                WHERE
                    department_id = :department_id
                ORDER BY
                    city_rank;
        `;

    const destinationsData = await db.sequelize.query(query, {
      replacements: { department_id: department_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!destinationsData.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Most frequent destinations fetched successfully.",
      data: destinationsData,
    });
  } catch (error) {
    console.error("Error fetching most frequent destinations:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getApprovalStatusReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, department_id, employee_id, status } =
      req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
            SELECT
                ER.id AS expense_request_id,
                ER.expense_request_number,
                ER.employee_id,
                CONCAT(HR.first_name, ' ', HR.last_name) AS employee_name,
                ER.department_id,
                MD.department_name,
                ER.expense_request_type,
                MAX(ERD.expense_date) AS latest_expense_date, 
                GROUP_CONCAT(DISTINCT EAL.expense_approvel_status ORDER BY EAL.id DESC) AS expense_approval_status,
                GROUP_CONCAT(DISTINCT EAL.expense_approval_remarks ORDER BY EAL.id DESC) AS expense_approval_remarks,
                GROUP_CONCAT(
                    DISTINCT 
                    CASE 
                        WHEN EAL.expense_approvel_status IN ('APPROVED', 'REJECTED') 
                        THEN DATE(EAL.updatedAt) 
                        ELSE NULL 
                    END 
                    ORDER BY EAL.id DESC
                ) AS approval_date,
                
                GROUP_CONCAT(DISTINCT EAL.employee_id) AS approver_id,
                GROUP_CONCAT(DISTINCT CONCAT(HRR.first_name, ' ', HRR.last_name)) AS approver_name,
                GROUP_CONCAT(DISTINCT ERD.exp_category_id) AS expense_category_ids,
                GROUP_CONCAT(DISTINCT ME.expense_type) AS expense_types
            FROM EXPENSE_REQUEST ER
            LEFT JOIN EXPENSE_REQUEST_DATA ERD ON ERD.expense_request_id = ER.id
            LEFT JOIN HRMS_REGISTERED_USER HR ON HR.employee_id = ER.employee_id
            LEFT JOIN MASTER_DEPARTMENT MD ON MD.dept_id = ER.department_id
            LEFT JOIN MASTER_EXPENSE ME ON ME.id = ERD.exp_category_id
            LEFT JOIN EXPENSE_APPROVEL_LEVEL EAL ON EAL.expense_request_id = ER.id
            LEFT JOIN HRMS_REGISTERED_USER HRR ON HRR.employee_id = EAL.employee_id
            WHERE ER.isDeleted = 0
                AND ER.entity_id = :entity_id
        `;

    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(ERD.expense_date) = :month_id`;
      replacements.month_id = month_id;
    }
    if (financial_year_id) {
      query += ` AND YEAR(ERD.expense_date) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }
    if (department_id) {
      query += ` AND ER.department_id = :department_id`;
      replacements.department_id = department_id;
    }
    if (employee_id) {
      query += ` AND ER.employee_id = :employee_id`;
      replacements.employee_id = employee_id;
    }
    if (status) {
      query += ` AND EAL.expense_approvel_status = :status`;
      replacements.status = status;
    }

    query += `
                GROUP BY ER.id, ER.expense_request_number, ER.employee_id, HR.first_name, HR.last_name,
                        ER.department_id, MD.department_name, ER.expense_request_type;
        `;
    const approvalStatusReport = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!approvalStatusReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Approval Status Report fetched successfully.",
      data: approvalStatusReport,
    });
  } catch (error) {
    console.error("Error fetching Approval Status Report:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};
exports.getReimbursementReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, department_id, employee_id, status } =
      req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
            SELECT 
                ER.id,
                ER.expense_request_number,
                ER.employee_id,
                CONCAT(HR.first_name,' ',HR.last_name) AS employee_name,
                HR.employee_code,
                ER.department_id,
                MD.department_name,
                SUM(
                    CASE WHEN ER.expense_final_status = 'APPROVED' THEN ER.advance_amount ELSE 0 END
                ) AS total_approved_advance_amount,
                SUM(
                    CASE WHEN ER.expense_final_status = 'APPROVED' THEN ER.advance_amount ELSE 0 END
                ) AS total_reimbursement_amount,
                MAX(
                    CASE WHEN ER.expense_final_status = 'APPROVED' THEN DATE_FORMAT(ER.updatedAt, '%Y-%m-%d') ELSE NULL END
                ) AS reimbursement_date,
                ER.expense_final_status
            FROM 
                EXPENSE_REQUEST ER
                LEFT JOIN HRMS_REGISTERED_USER HR ON HR.employee_id = ER.employee_id
                LEFT JOIN MASTER_DEPARTMENT MD ON MD.dept_id = ER.department_id
            WHERE
                ER.entity_id = :entity_id
                AND ER.isDeleted = 0
        `;

    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(ER.updatedAt) = :month_id`;
      replacements.month_id = month_id;
    }
    if (financial_year_id) {
      query += ` AND YEAR(ER.updatedAt) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }
    if (department_id) {
      query += ` AND ER.department_id = :department_id`;
      replacements.department_id = department_id;
    }
    if (employee_id) {
      query += ` AND ER.employee_id = :employee_id`;
      replacements.employee_id = employee_id;
    }
    if (status) {
      query += ` AND ER.expense_final_status = :status`;
      replacements.status = status;
    }

    query += `
                GROUP BY
                    ER.id,
                    ER.expense_request_number,
                    ER.employee_id,
                    ER.department_id,
                    ER.expense_final_status
                ORDER BY ER.id DESC;
        `;
    const reimbursementReport = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!reimbursementReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Reimburesement Report fetched successfully.",
      data: reimbursementReport,
    });
  } catch (error) {
    console.error("Error fetching Approval Status Report:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getExpenseReimbursementReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, employee_id } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
        SELECT 
            ER.employee_id,
            HR.employee_code,
            CONCAT(HR.first_name, ' ', HR.last_name) AS employee_name,
            ER.expense_request_number,
            ER.current_date AS submission_date, 
            DATE_FORMAT(MAX(ER.updatedAt), '%Y-%m-%d') AS approval_date, 
            DATE_FORMAT(MAX(ER.updatedAt), '%Y-%m-%d') AS reimbursement_date,
            DATEDIFF(MAX(ER.updatedAt), ER.current_date) AS total_processing_time
        FROM EXPENSE_REQUEST ER
        LEFT JOIN HRMS_REGISTERED_USER HR ON HR.employee_id = ER.employee_id
        WHERE 
            ER.entity_id = :entity_id
            AND ER.isDeleted = 0
            AND ER.expense_final_status = 'APPROVED'
        `;

    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(ER.current_date) = :month_id`;
      replacements.month_id = month_id;
    }
    if (financial_year_id) {
      query += ` AND YEAR(ER.current_date) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }
    if (employee_id) {
      query += ` AND ER.employee_id = :employee_id`;
      replacements.employee_id = employee_id;
    }

    query += ` GROUP BY 
                    ER.employee_id, 
                    ER.expense_request_number, 
                    ER.current_date,
                    HR.employee_code,
                    HR.first_name,
                    HR.last_name;`;

    const expenseReimbursementReport = await db.sequelize.query(query, {
      replacements: replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!expenseReimbursementReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }
    return res.status(200).json({
      code: 200,
      message: "Expense Reimbursement Report fetched successfully.",
      data: expenseReimbursementReport,
    });
  } catch (error) {
    console.error("Error fetching Expense Reimbursement Report:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getUnsubmittedReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, employee_id } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
            SELECT
                TR.id,
                TR.travel_request_number,
                HR.employee_code,
                TR.user_id,
                CONCAT(HR.first_name, ' ', HR.last_name) AS employee_name,
                TR.department_id,
                TR.department,
                DATE_FORMAT(MIN(TRD.travel_from_date), '%Y-%m-%d') AS earliest_travel_from_date,
                DATE_FORMAT(MAX(TRD.travel_to_date), '%Y-%m-%d') AS latest_travel_to_date,
                TR.total_amount,
                GREATEST(DATEDIFF(CURDATE(), MAX(TRD.travel_to_date)), 0) AS pending_submission_days
            FROM ESS_TRAVEL_REQUEST TR
            LEFT JOIN ESS_TRAVEL_REQUEST_DATA TRD ON TRD.travel_request_id = TR.id
            LEFT JOIN HRMS_REGISTERED_USER HR ON HR.employee_id = TR.user_id
            LEFT JOIN EXPENSE_REQUEST ER ON ER.travel_request_id = TR.id
            WHERE
                TR.isDeleted = 0
                AND TR.entity_id = :entity_id
                AND TR.travel_request_status = 'APPROVED'
                AND ER.travel_request_id IS NULL
            GROUP BY TR.id, TR.travel_request_number, TR.user_id, TR.department_id, TR.department, TR.total_amount, HR.first_name, HR.last_name
            ORDER BY pending_submission_days DESC;
        `;

    const expenseReimbursementReport = await db.sequelize.query(query, {
      replacements: { entity_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!expenseReimbursementReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    let filteredData = expenseReimbursementReport;

    if (month_id) {
      filteredData = filteredData.filter((record) => {
        const travelToDate = new Date(record.latest_travel_to_date);
        return travelToDate.getMonth() + 1 === parseInt(month_id);
      });
    }

    if (financial_year_id) {
      filteredData = filteredData.filter((record) => {
        const travelToDate = new Date(record.latest_travel_to_date);
        return travelToDate.getFullYear() === parseInt(financial_year_id);
      });
    }

    if (employee_id) {
      filteredData = filteredData.filter(
        (record) => record.user_id === parseInt(employee_id)
      );
    }

    if (!filteredData.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Unsubmitted Expense Report fetched successfully.",
      data: filteredData,
    });
  } catch (error) {
    console.error("Error fetching Unsubmitted Expense Report:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getExpenseTrendReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    const replacements = { entity_id };
    let dateFilters = "";

    if (month_id) {
      dateFilters += ` AND MONTH(ER.current_date) = :month_id`;
      replacements.month_id = month_id;
    }
    if (financial_year_id) {
      dateFilters += ` AND YEAR(ER.current_date) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }

    const expenseQuery = `
            SELECT
                SUM(ER.advance_amount) AS reimbursement_amount,
                SUM(ERD.exp_amount) AS total_expense
            FROM
                EXPENSE_REQUEST ER
                LEFT JOIN EXPENSE_REQUEST_DATA ERD ON ERD.expense_request_id = ER.id
            WHERE
                ER.isDeleted = 0
                AND ER.entity_id = :entity_id
                ${dateFilters}
        `;

    const expenseReimbursementReport = await db.sequelize.query(expenseQuery, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    const departmentQuery = `
            SELECT
                tr.department_id,
                tr.department,
                SUM(
                    CASE WHEN ER.expense_final_status = 'APPROVED'
                    THEN ER.advance_amount ELSE 0 END
                ) AS total_approved_expense_amount
            FROM
                ESS_TRAVEL_REQUEST tr
                LEFT JOIN EXPENSE_REQUEST ER ON ER.travel_request_id = tr.id
            WHERE
                tr.entity_id = :entity_id
                AND tr.isDeleted = 0
                ${dateFilters}
            GROUP BY
                tr.department_id, tr.department
            ORDER BY
                total_approved_expense_amount DESC
            LIMIT 4
        `;

    const departmentExpenseReport = await db.sequelize.query(departmentQuery, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    const categoryExpenseQuery = `
            SELECT
                ERD.exp_category_id,
                ME.expense_type,
                SUM(ERD.exp_amount) AS total_exp_amount,
                SUM(ER.advance_amount) AS total_advance_amount
            FROM
                EXPENSE_REQUEST ER
                LEFT JOIN EXPENSE_REQUEST_DATA ERD ON ERD.expense_request_id = ER.id
                LEFT JOIN MASTER_EXPENSE ME ON ME.id = ERD.exp_category_id
            WHERE
                ER.isDeleted = 0
                AND ER.entity_id = :entity_id
                ${dateFilters}
            GROUP BY
                ERD.exp_category_id,
                    ME.expense_type
        `;

    const categoryExpenseReport = await db.sequelize.query(
      categoryExpenseQuery,
      {
        replacements,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const expenseTypeUsageQuery = `
            SELECT
                ERD.exp_category_id,
                ME.expense_type,
                COUNT(ERD.exp_category_id) AS usage_count,
                SUM(ERD.exp_amount) AS total_exp_amount,
                SUM(ER.advance_amount) AS total_advance_amount
            FROM
                EXPENSE_REQUEST ER
                LEFT JOIN EXPENSE_REQUEST_DATA ERD ON ERD.expense_request_id = ER.id
                LEFT JOIN MASTER_EXPENSE ME ON ME.id = ERD.exp_category_id
            WHERE
                ER.isDeleted = 0
                AND ER.entity_id = :entity_id
                ${dateFilters}
            GROUP BY
                ERD.exp_category_id, ME.expense_type
            ORDER BY
                usage_count DESC
        `;

    const expenseTypeUsageReport = await db.sequelize.query(
      expenseTypeUsageQuery,
      {
        replacements,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (
      !expenseReimbursementReport.length &&
      !departmentExpenseReport.length &&
      !categoryExpenseReport.length &&
      !expenseTypeUsageReport.length
    ) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Expense Reimbursement Report fetched successfully.",
      data: {
        expenseReimbursementReport,
        departmentExpenseReport,
        categoryExpenseReport,
        expenseTypeUsageReport,
      },
    });
  } catch (error) {
    console.error("Error fetching Expense Reimbursement Report:", error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};
