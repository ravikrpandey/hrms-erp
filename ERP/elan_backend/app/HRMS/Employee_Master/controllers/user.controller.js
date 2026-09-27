const db = require("../../../models");
const config = require("../../../config/auth.config");
const emailVarify = require("../../../utils/validation");
const transport = require("../../../master/services/nodemailer");
const { where } = require("sequelize");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.usersTest = (req, res) => {
  res.status(200).send("UserTestcontent.");
};

exports.officeLocation = (req, res) => {
  res.status(200).send("UserTestcontent.");
};
exports.leaveType = (req, res) => {
  res.status(200).send("UserTestcontent.");
};

exports.getChildEmployee = async (req, res) => {
  try {
    // Input validation
    const { emId } = req.params;
    if (!emId || isNaN(parseInt(emId))) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or missing employee ID",
      });
    }

    // Query employees with specific attributes and proper error handling
    const users = await db.user.findAll({
      where: { reporting_manager_id: parseInt(emId) },
      attributes: ["employee_id", "first_name", "last_name"], // Select only needed fields
      raw: true, // Optimize by returning plain objects
    });

    // Check if any employees were found
    if (!users || users.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No employees found for this manager",
      });
    }

    // Return success response
    return res.status(200).json({
      status: "success",
      data: users,
      count: users.length,
    });
  } catch (error) {
    // Log error for debugging (in a production environment, use a proper logging service)
    console.error("Error in getChildEmployee:", error.message);

    // Return detailed error response
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getCustomerByIDForPanel = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid customer ID",
      });
    }

    const customer = await db.customerProfile.findOne({
      where: { id: Number(id) },
      attributes: ["id", "company_name", "customer_code", "pan_number", "identification", "advance_amount"],
      include: [
        {
          model: db.customer_category,
          attributes: ["customer_category_name"],
          required: false,
        },
        {
          model: db.customerType,
          attributes: ["customer_type_name"],
          required: false,
        }
      ],
    });

    // Customer not found
    if (!customer) {
      return res.status(404).json({
        status: "error",
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        id: customer.id,
        company_name: customer.company_name,
        customer_code: customer.customer_code,
        pan_number: customer.pan_number,
        identification: customer.identification,
        customer_category_name: customer.MASTER_CUSTOMER_CATEGORY?.customer_category_name || null,
        customer_type_name: customer.MASTER_CUSTOMER_TYPE?.customer_type_name || null,
        advance_amount: customer.advance_amount
      },
    });

  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getSOListForCustomer = async (req, res) => {
  try {

    const { id, type } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({status: "error", message: "Invalid customer ID"});
    }

    // Use For Dashboard Limit
    const limitQuery =
      type && type.toLowerCase() === 'dashboard'
        ? 'LIMIT 5'
        : '';

    const [result] = await db.sequelize.query(`
      SELECT SO.id,
		SO.sales_order_no,
		SO.sales_order_date,
		SO.expected_delivery_date,
		SO.delivered_on_date,
		SO.dispatch_status AS order_status,
	  COALESCE(SUM(SOI.qty), 0) AS total_delivered_quantity,
	  CONCAT_WS(', ', SO.address, SO.postal_address, SO.pincode) AS delivery_address,
	  SUM(
	  (SOI.qty * SOI.price_per_unit) +
	  ((SOI.qty * SOI.price_per_unit) * SOI.igst / 100)
	  ) AS order_amount,
	  CASE
	  WHEN EXISTS (
	      SELECT 1
	      FROM CRM_SALES_INVOICE_MST SI
	      WHERE SI.so_id = SO.id
	        AND SI.invoice_status = 'APPROVED'
	  ) THEN 'APPROVED'
	  ELSE 'PENDING'
	 END AS so_invoice_status
      FROM SALES_ORDER_MST AS SO
      INNER JOIN SALES_ORDER_ITEM_LIST_NEW AS SOI
        ON SOI.sales_order_id = SO.id
        AND SOI.parent_item_id IS NULL
      AND SO.customer_id = :id
      GROUP BY SO.id
      ORDER BY SO.id DESC
      ${limitQuery};
    `, {
      replacements: { id:id }
    });

    return res.status(200).send({code: 200, message: "Record fetched successfully", data: result});

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};

exports.getCustomerContactAddress = async (req, res) => {
  try {

    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid customer ID",
      });
    }

    const customer = await db.customerAddressContact.findAll({
      where: {
        customer_id: Number(id)
      }
    });

    const billingAddress = await db.sequelize.query(`
      SELECT
        CA.id,
        CA.billing_address AS address,
        CA.billing_pin_code AS pincode,
        CA.billing_postal_address AS postal_address,
        C.countryss_name AS country_name,
        S.states_name AS state_name,
        CI.city_name AS city_name,
        CA.gst_category AS gst_type,
        CA.gst_in AS gstIn
      FROM CUSTOMER_ADDRESS_MST CA
      LEFT JOIN MASTER_COUNTRY C
        ON CA.billing_country_id = C.countryss_id
      LEFT JOIN MASTER_STATE S
        ON CA.billing_state_id = S.states_id
      LEFT JOIN MASTER_CITY CI
        ON CA.billing_city_id = CI.city_id
      WHERE CA.customer_id = :customer_id
    `, {
      replacements: {
        customer_id: Number(id)
      },
      type: db.sequelize.QueryTypes.SELECT
    });

    const shippingAddress = await db.sequelize.query(`
      SELECT
        CA.id,
        CA.shipping_address AS address,
        CA.shipping_pin_code AS pincode,
        CA.shipping_postal_address AS postal_address,
        C.countryss_name AS country_name,
        S.states_name AS state_name,
        CI.city_name AS city_name,
        CA.shipping_gst_category AS gst_type,
        CA.shipping_gst_in AS gstIn
      FROM CUSTOMER_SHIPPING_ADDRESS_MST CA
      LEFT JOIN MASTER_COUNTRY C
        ON CA.shipping_country_id = C.countryss_id
      LEFT JOIN MASTER_STATE S
        ON CA.shipping_state_id = S.states_id
      LEFT JOIN MASTER_CITY CI
        ON CA.shipping_city_id = CI.city_id
      WHERE CA.customer_id = :customer_id
    `, {
      replacements: {
        customer_id: Number(id)
      },
      type: db.sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({
      status: "success",
      data: {
        contactPersons: customer.length > 0 ? customer : null,
        billingAaddress: billingAddress.length > 0 ? billingAddress : null,
        shippingAddress: shippingAddress.length > 0 ? shippingAddress : null
      }
    });

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.getCustomerDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid customer ID",
      });
    }

    const orderCount = await db.salesOrder.findOne({
      attributes: [
        [
          db.sequelize.fn('COUNT', db.sequelize.col('id')),
          'total_order'
        ],
        [
          db.sequelize.fn(
            'SUM',
            db.sequelize.literal(`
              CASE 
                WHEN dispatch_status = 'APPROVED' THEN 1 
                ELSE 0 
              END
            `)
          ),
          'complete_order'
        ],
        [
          db.sequelize.literal(`
            COUNT(id) - SUM(
              CASE 
                WHEN dispatch_status = 'APPROVED' THEN 1 
                ELSE 0 
              END
            )
          `),
          'pending_order'
        ]
      ],
      where: {
        customer_id: id
      },
      raw: true
    });

    return res.status(200).json({
      status: "success",
      data: {
        orderCount: orderCount
      },
    });

  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};