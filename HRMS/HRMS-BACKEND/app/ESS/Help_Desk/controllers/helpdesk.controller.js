const { body } = require("express-validator");
const db = require("../../../models/index");
const User = db.user;
const helpDeskDetails = db.helpDesk;
const op = db.sequelize.op;
const departmentmaster = db.department;
const ticketCatogery = db.ticket_category;
const ticketAllocatedTicket = db.my_allocatedticket;
const ticketDocument = db.myticket_document;
const registeruser = db.user;
const allocatedEmployee = db.ticket_allocated_emp;
const multer = require("multer");
const path = require("path");
const { query } = require("express");
const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const uploadDir = path.join("uploaded_files");
const { sequelize } = db;

/////////////// Create Help Desk ///////////////

exports.createHelpDesk = async (req, res) => {
  try {
    const {
      requester,
      subject,
      assignee,
      field_title,
      request_for,
      priority,
      type_of_document,
      request_no,
      description,
      employee_id,
      status1,
    } = req.body;
    const req_name = await User.findOne({ where: { employee_id: requester } });
    const response = await helpDeskDetails.create({
      status1,
      requester,
      requester_name: req_name.first_name + " " + req_name.last_name,
      subject,
      assignee,
      field_title,
      request_for,
      priority,
      type_of_document,
      request_no,
      description,
      employee_id,
    });
    console.log(response);
    // const update_request=await helpDeskDetails.update({request_no:response.employee_helpDesk_id},{where:{employee_helpDesk_id:response.employee_helpDesk_id}})
    return res.status(200).send({
      code: 200,
      message: "Help Desk Created Successfully!",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Edit Help Desk ///////////////

exports.editHelpDesk = async (req, res) => {
  try {
    const helpDeskId = req.params.id;

    const helpData = await helpDeskDetails.findOne({
      where: { employee_helpDesk_id: helpDeskId },
    });

    if (!helpData) {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }

    const {
      requester,
      requester_name,
      subject,
      field_title,
      request_for,
      priority,
      type_of_document,
      request_no,
      description,
      status1,
      first_name
    } = req.body;

    await helpDeskDetails.update(
      {
        requester,
        requester_name,
        subject,
        field_title,
        request_for,
        priority,
        type_of_document,
        request_no,
        description,
        status1,
        first_name
      },
      {
        where: { employee_helpDesk_id: helpDeskId }
      }
    );

    return res.status(200).send({
      code: 200,
      message: "Help Desk Updated Successfully",
    });

  } catch (error) {
    console.error("Error updating help desk:", error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};


/////////////// Get All Help Desk ///////////////

exports.getAllHelpDesk = async (req, res) => {
  try {
    const Data = await User.findOne({
      attributes: ["first_name", "employee_id"],
    });
    let candidateone = Data.employee_id;
    const getAllData = await helpDeskDetails.findAll({
      // where: {employee_id: candidateone},
      where: { status: "ACTIVE" },
      include: [
        {
          model: User,
          attributes: ["first_name"],
        },
      ],
    });
    getAllData.sort().reverse();
    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Help Desk Data Successfully",
        data: getAllData,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getByIdAllHelpDesk = async (req, res) => {
  try {
    const { id: employee_id } = req.params;

    const result = await db.sequelize.query(
      `
      SELECT ehd.*, hru.first_name
      FROM ESS_HELP_DESK AS ehd
      INNER JOIN HRMS_REGISTERED_USER AS hru 
          ON hru.employee_id = ehd.employee_id 
      WHERE ehd.assignee  = :employee_id
      `,
      {
        replacements: { employee_id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      code: 200,
      message: "Fetched help desk data successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching help desk data:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error.",
      error: error.message, // Optional: remove in production
    });
  }
};

/////////////// GetById Help Desk ///////////////

exports.getByIdHelpDesk = async (req, res) => {
  try {
    const employee_helpDesk_id = req.params.id;
    console.log(
      "===========================>>>>>>>>>>>>>>>>>>",
      employee_helpDesk_id
    );
    const getData = await helpDeskDetails.findOne({
      where: { employee_helpDesk_id: employee_helpDesk_id },
    });
    console.log("******************+++++++++", getData);
    // console.log(getData);
    if (getData) {
      return res
        .status(200)
        .send({ code: 200, message: "Fetch data Successfully", data: getData });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Delete Help Desk ///////////////

exports.deleteHelpDesk = async (req, res) => {
  try {
    const helpDeskId = req.params.id;
    const dltHelpDesk = await helpDeskDetails.findOne({
      where: { employee_helpDesk_id: helpDeskId },
    });
    if (dltHelpDesk) {
      const deleteData = await helpDeskDetails.update(
        { status: "INACTIVE" },
        { where: { employee_helpDesk_id: helpDeskId } }
      );
      return res.status(200).send({
        code: 200,
        message: "Help Desk Data is Deleted Successfully!",
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

exports.get_Unique_Req_No = async (req, res) => {
  try {
    // const employee_helpDesk_id = req.params.id;
    const req_no = await helpDeskDetails.findAll({
      // limit: 1
      // where : {employee_helpDesk_id:employee_helpDesk_id},
      order: [["createdAt", "DESC"]],
      attributes: ["employee_helpDesk_id"],
    });
    const last_digit = req_no[0].employee_helpDesk_id;
    // const request_no = Math.floor(10000 + Math.random() * 90000);
    const result = last_digit + 1;
    if (result) {
      return res.status(200).send({
        code: 200,
        message: "Unique Request Number has been Generated",
        data: result,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.get_Unique_Req_No_Patch = async (req, res) => {
  try {
    const employee_helpDesk_id = req.params.id;
    const req_no = await helpDeskDetails.findAll({
      // limit: 1
      where: { employee_helpDesk_id: employee_helpDesk_id },
      order: [["createdAt", "DESC"]],
      attributes: ["employee_helpDesk_id"],
    });
    console.log("hello word");
    //    console.log(req_no);
    const last_digit = req_no[0].employee_helpDesk_id;
    // const request_no = Math.floor(10000 + Math.random() * 90000);
    const result = last_digit;
    if (result) {
      return res.status(200).send({
        code: 200,
        message: "Unique Request Number has been Generated",
        data: result,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};





//Start the api in help desk based on new requirment

exports.get_Department_newhelp_desk = async (req, res) => {
  try {
    const data = await departmentmaster.findAll({});
    if (data) {
      return res.status(200).send({
        code: 200,
        message: "Unique Request Number has been Generated",
        data: data,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.get_Categoey_code = async (req, res) => {
  try {
    const maxCategory = await ticketCatogery.findOne({
      attributes: [[sequelize.fn("MAX", sequelize.col("id")), "maxId"]],
      raw: true,
    });
    if (maxCategory) {
      const newId = maxCategory.maxId + 1;
      const categoryCode = `CATE${String(newId).padStart(4, "0")}`;
      return res.status(200).send({
        code: 200,
        message: "Unique Request Number has been Generated",
        data: { categoryCode },
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "Unique Request Number has been Generated",
        data: { categoryCode: "CATE0001" },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.create_Category_master = async (req, res) => {
  try {
    const { categoryCode, categoryName, dept_id } = req.body;

    if (!categoryCode || !categoryName || !dept_id) {
      return res.status(400).json({
        message: "categoryCode, categoryName, and dept_id are required.",
      });
    }
    const existingCategory = await ticketCatogery.findOne({
      where: { categoryCode },
    });
    if (existingCategory) {
      return res.status(403).json({ message: "Category code already exists." });
    } else {
      const newCategory = await ticketCatogery.create({
        categoryCode,
        categoryName,
        dept_id,
      });

      return res.status(201).json({ message: "Category created successfully!", data: newCategory });
    }
  } catch (error) {
    console.error("Error during category creation:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAll_data_tikcet_category = async (req, res) => {
  try {
    // Modify the query to exclude records where isDeleted is 1
    const data = await ticketCatogery.findAll({
      where: {
        isDeleted: 0, // Filter out records where isDeleted = 1
      },
      include: [
        {
          model: db.department,
          attributes: ["department_name", "dept_id"],
        },
      ],
    });

    if (data && data.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Data the Tikcet category master",
        data: data,
      });
    } else {
      return res.status(403).send({
        code: 403,
        message: "Record Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: "Server Error",
    });
  }
};

exports.CHECKLISTStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (status === undefined) {
      return res.status(400).send({
        code: 400,
        message:
          "Bad Request: 'status' property is missing in the request body",
      });
    }

    console.log(status);
    const getData = await ticketCatogery.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    if (getData) {
      await ticketCatogery.update(
        {
          status,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).send({
        code: 200,
        message: "checklist details Status Change Successfully!",
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

exports.updateTicketCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { categoryName, categoryCode, dept_id } = req.body;

    const checklistdata = await ticketCatogery.findOne({ where: { id: id } });
    if (!checklistdata) {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }

    await ticketCatogery.update(
      { categoryCode, categoryName, dept_id },
      { where: { id: id } }
    );
    return res
      .status(200)
      .send({ code: 200, message: "Data is Updated Successfully!" });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.deleteCHECKLIST = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log("Record ID:", id);  // Log the ID being used
    const checklistData = await ticketAllocatedTicket.findOne({ where: { id: id } });

    if (checklistData) {
      console.log("Record Found:", checklistData); // Log the found record data

      // Ensure `isDeleted` column is being correctly updated
      const updateResult = await ticketAllocatedTicket.update({ isDeleted: true }, { where: { id: id } });

      if (updateResult[0] === 0) {
        return res.status(400).send({ code: 400, message: "Failed to mark as deleted." });
      }

      return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!" });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log("Error during delete operation:", error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};


exports.gettheSingleRecordTicketcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const getData = await db.ticket_category.findOne({
      where: { id: id, isDeleted: 0 },
      include: [
        {
          model: db.department,

          attributes: ["department_name"],
          required: false,
        },
      ],
    });
    if (getData) {
      const formattedData = {
        id: getData.id,
        categoryName: getData.categoryName,
        categoryCode: getData.categoryCode,
        isDeleted: getData.isDeleted,
        status: getData.status,
        createdAt: getData.createdAt,
        updatedAt: getData.updatedAt,
        dept_id: getData.dept_id,
        department_name: getData.department_data
          ? getData.department_data.department_name
          : null,
      };
      return res.status(200).send({
        code: 200,
        message: "Ticket Category Details Retrieved Successfully!",
        data: formattedData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Record Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.createTicket = async (req, res) => {
  const {
    formType,
    ticketType,
    employee_id,
    department_id,
    ticket_category_id,
    priority,
    subject,
    description,
    documentDetails, created_by
  } = req.body;

  try {
    const ticket = await db.my_allocatedticket.create({
      formtype: formType,
      forperson: ticketType,
      dept_id: department_id,
      category_id: ticket_category_id,
      priority: priority,
      subject: subject,
      description: description,
      employee_id: employee_id, created_by
    });

    if (documentDetails && documentDetails.length > 0) {
      const documents = documentDetails.map((doc) => ({
        filename: doc.document_path,
        ticket_id: ticket?.id,
      }));

      await db.myticket_document.bulkCreate(documents);
    }

    res.status(201).json({
      status: "success",
      message: "Ticket created successfully",
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      message: error.message || "Failed to create ticket",
    });
  }
};

exports.create_allocated_Ticket = async (req, res) => {
  const {
    status_type, ticket_id, remark,
    allocate_id,
  } = req.body;

  try {
    const alreadyallocated = await db.my_allocatedticket.findOne({ where: { allocate_id: allocate_id, id: ticket_id } });
    if (allocate_id != null && alreadyallocated && alreadyallocated != null) {
      res.status(403).json({
        code: 403, status: "success", message: "You have already assigned the same ticket to this Employee.",
      });
    } else {
      const ticket = await db.my_allocatedticket.update({
        status_type, allocate_id, remark
      }, { where: { id: ticket_id } });
      res.status(201).json({ status: "success", message: "Ticket status updated successfully" });
    }
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      message: error.message || "Failed to allocate ticket",
    });
  }
};

exports.update_ticketstatus = async (req, res) => {
  const {
    status_type, remark, ticket_id
  } = req.body;

  try {
    const ticket = await db.my_allocatedticket.update({
      status_type, remark
    }, { where: { id: ticket_id } });

    res.status(201).json({
      status: "success", message: "Ticket Closed Successfully",
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      message: error.message || "Failed to allocate ticket",
    });
  }
};

exports.get_all_ticket_list = async (req, res) => {
  try {
    let { employee_id } = req.query;
    const employeeId = parseInt(employee_id);

    let query = `
        SELECT 
          MAT.id,
          MAT.formtype,
          MAT.forperson,
          MAT.dept_id,
          MAT.category_id,
          MAT.priority,
          MAT.subject,
          MAT.description,
          MAT.status AS ticket_status,MAT.status_type as user_ticket_status,
          MAT.employee_id,
          dept.department_name,
          hru.first_name,
          hru.last_name,
          Tc.categoryCode,
          Tc.categoryName
        FROM 
          ESS_MY_ALLOCATED_TICKET MAT
        LEFT JOIN MASTER_DEPARTMENT dept ON MAT.dept_id = dept.dept_id
        LEFT JOIN HRMS_REGISTERED_USER hru ON MAT.employee_id = hru.employee_id
        LEFT JOIN TICKET_CATEGORY Tc ON MAT.category_id = Tc.id
        WHERE 
          MAT.isDeleted = false
          AND MAT.formtype = 'My Ticket'
      `;
    const replacements = [];
    if (employeeId && employeeId != null) {
      query += `AND MAT.created_by = ?`;
      replacements.push(employeeId);
    }
    const [results] = await sequelize.query(query, { replacements });
    res.status(200).json({ status: 200, data: results });
  } catch (error) {
    console.error("Error fetching tickets with details:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

exports.get_allocated_ticketLIST = async (req, res) => {
  try {
    let { employee_id } = req.query;
    const employeeId = parseInt(employee_id);

    let query = `
        SELECT 
          MAT.id,
          MAT.formtype,
          MAT.forperson,
          MAT.dept_id,
          MAT.category_id,
          MAT.priority,
          MAT.subject,
          MAT.description,
          MAT.status AS ticket_status,MAT.status_type as user_ticket_status,
          MAT.employee_id,
          dept.department_name,MAT.allocate_id,
          hru.first_name,
          hru.last_name,
          Tc.categoryCode,
          Tc.categoryName
        FROM 
          ESS_MY_ALLOCATED_TICKET MAT
        LEFT JOIN MASTER_DEPARTMENT dept ON MAT.dept_id = dept.dept_id
        INNER JOIN HRMS_REGISTERED_USER hru ON MAT.allocate_id = hru.employee_id
        LEFT JOIN TICKET_CATEGORY Tc ON MAT.category_id = Tc.id
        WHERE 
          MAT.isDeleted = false
          AND MAT.formtype = 'My Ticket'
      `;
    const replacements = [];
    if (employeeId && employeeId != null) {
      query += ` AND MAT.allocate_id = ?`;
      replacements.push(employeeId);
    }
    const [results] = await sequelize.query(query, { replacements });
    res.status(200).json({ status: 200, data: results });
  } catch (error) {
    console.error("Error fetching tickets with details:", error);
    res.status(500).json({
      status: 500, message: "Failed to fetch tickets", error: error.message,
    });
  }
};

exports.deleteAllocatedticket = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const checklistData = await ticketAllocatedTicket.findOne({
      where: { id: id },
    });
    if (checklistData) {
      await ticketAllocatedTicket.update(
        { isDeleted: true },
        { where: { id: id } }
      );
      await ticketDocument.update(
        { isDeleted: true },
        { where: { ticket_id: id } }
      );

      return res
        .status(200)
        .send({ code: 200, message: "Data is Deleted Successfully!" });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.updateTicket = async (req, res) => {
  const {
    formType,
    ticketType,
    employee_id,
    department_id,
    ticket_category_id,
    priority,
    subject,
    description,
    documentDetails,
  } = req.body;
  const { id } = req.params;
  try {
    const ticket = await db.my_allocatedticket.findByPk(id);
    if (!ticket) {
      return res
        .status(404)
        .json({ status: "error", message: "Ticket not found" });
    }
    await ticket.update({
      formtype: formType,
      forperson: ticketType,
      dept_id: department_id,
      category_id: ticket_category_id,
      priority: priority,
      subject: subject,
      description: description,
      employee_id: employee_id,
    });
    if (documentDetails && documentDetails.length > 0) {
      await db.myticket_document.destroy({ where: { ticket_id: id } });
      const documents = documentDetails.map((doc) => ({
        filename: doc.document_path,
        ticket_id: id,
      }));

      await db.myticket_document.bulkCreate(documents);
    }

    res.status(200).json({ status: "success", message: "Ticket updated successfully" });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to update ticket" });
  }
};

exports.getAllocateddataById = async (req, res) => {
  try {
    const { id } = req.params;
    const allocatedTicket = await ticketAllocatedTicket.findOne({
      where: {
        id,
      },
      include: [
        {
          model: registeruser,
          attributes: ["employee_id", "first_name"],
        },
        {
          model: ticketDocument,
          attributes: ["id", "filename"],
        },
      ],
    });
    if (!allocatedTicket) {
      return res.status(404).json({
        message: `Allocated ticket with ID ${id} not found.`,
      });
    }
    const plainTicket = allocatedTicket.get({ plain: true });
    res.status(200).json({
      message: "Allocated ticket fetched successfully!",
      data: plainTicket,
    });
  } catch (error) {
    console.error("Error fetching allocated ticket:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

exports.checklistUpdateAlloactedTicket = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (status === undefined) {
      return res.status(400).send({
        code: 400,
        message: "'status' property is missing in the request body",
      });
    }
    const getData = await db.my_allocatedticket.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    if (!getData) {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
    await db.my_allocatedticket.update(
      {
        status,
      },
      {
        where: {
          id: id,
          isDeleted: false,
        },
      }
    );
    await db.myticket_document.update(
      {
        status,
      },
      {
        where: {
          ticket_id: id,
          isDeleted: false,
        },
      }
    );
    return res.status(200).send({
      code: 200,
      message:
        "Checklist details Status Updated Successfully for all related documents!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.employeData = async (req, res) => {
  try {
    const { entity_id, employee_id } = req.body;
    let whereCondition = {};
    if (entity_id) whereCondition.entity_id = entity_id;
    if (employee_id) whereCondition.employee_id = employee_id;
    const userData = await db.user.findAll({
      where: whereCondition,
      attributes: ["employee_id", "first_name", "last_name", "employee_code"],
    });

    res.status(200).json({ status: "success", data: userData });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch employee data" });
  }
};

exports.getreportingManager = async (req, res) => {
  try {
    const { id } = req.params;

    const employees = await db.user.findAll({
      where: {
        reporting_manager_id: id,
      },
    });

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No employees found for the given reporting manager.",
      });
    }

    return res.status(200).json({
      status: 200,
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching reporting manager details:", error);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch reporting manager details.",
      error: error.message,
    });
  }
};




exports.getStatusWiseOpenOrCloseddata = async (req, res) => {
  try {
    const query = `
      SELECT 
        status_type, 
        COUNT(CASE WHEN status_type = 'OPEN' THEN 1 ELSE NULL END) AS open_count,
        COUNT(CASE WHEN status_type = 'CLOSE' THEN 1 ELSE NULL END) AS close_count,
        COUNT(allocate_id) AS allocate_count
      FROM 
        ESS_MY_ALLOCATED_TICKET
      WHERE 
        status_type IN ('OPEN', 'CLOSE') 
        AND isDeleted = 0
      GROUP BY 
        status_type
    `;
    const [results] = await sequelize.query(query);
    let open_count = 0;
    let close_count = 0;
    let allocate_count = 0;
    results.forEach(item => {
      if (item.status_type === 'OPEN') {
        open_count = item.open_count;
      }
      if (item.status_type === 'CLOSE') {
        close_count = item.close_count;
      }
      allocate_count += item.allocate_count;
    });
    res.status(200).json({
      status: 200,
      data: [
        {
          open_count,
          close_count,
          allocate_count
        }
      ]
    });
  } catch (error) {
    console.error("Error fetching tickets with details:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

exports.getAllManagers = async (req, res) => {
  try {

    const employees = await db.user.findAll({
      where: {
        status: "ACTIVE",
      },
      attributes:['first_name','last_name']
    });

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No manager found!.",
      });
    }

    return res.status(200).json({
      status: 200,
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching manager details:", error);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch manager details.",
      error: error.message,
    });
  }
};