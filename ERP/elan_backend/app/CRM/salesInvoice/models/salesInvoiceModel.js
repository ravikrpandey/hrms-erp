const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const addInvoice = sequelize.define(
    "CRM_SALES_INVOICE_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sales_invoice_no: {
        type: Sequelize.STRING,
      },
      sales_invoice_date: {
        type: Sequelize.DATEONLY
      },

      payment_due_days: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.ENUM("UNPAID", "PAID", "PARTIALLY PAID"),
        defaultValue: "UNPAID"
      },

      invoice_status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'CANCELLED'),
        defaultValue: "APPROVED",
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: "ACTIVE",
      },
      // customer_id: {
      //   type: Sequelize.BIGINT,
      // },

      // sales_order_id: {
      //   type: Sequelize.BIGINT,
      // },     

      exchange_rate: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },
      utilize_gross_dic_amt: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },
      subtotal: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },
      total_gst: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },

      discount_amount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },

      taxable_amount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },

      cgst_amount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },

      sgst_amount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },

      igst_amount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },

      grand_total: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },

      remarks: {
        type: Sequelize.TEXT,
      },
      cancelled_invoice_date: {
        type: Sequelize.DATEONLY
      },
      billing_address: {
        type: Sequelize.STRING
      },
      billing_postal_address: {
        type: Sequelize.STRING
      },
      billing_state: {
        type: Sequelize.STRING
      },
      billing_gst: {
        type: Sequelize.STRING
      },
      billing_contact_person: {
        type: Sequelize.STRING
      },
      billing_contact_person_no: {
        type: Sequelize.STRING
      },
      shipping_address: {
        type: Sequelize.STRING
      },
      shipping_postal_address: {
        type: Sequelize.STRING
      },
      shipping_state: {
        type: Sequelize.STRING
      },
      shipping_gst: {
        type: Sequelize.STRING
      },
      shipping_contact_person: {
        type: Sequelize.STRING
      },
      shipping_contact_person_no: {
        type: Sequelize.STRING
      },
      dispatch_address: {
        type: Sequelize.STRING
      },
      dispatch_postal_address: {
        type: Sequelize.STRING
      },
      dispatch_state: {
        type: Sequelize.STRING
      },
      dispatch_gst: {
        type: Sequelize.STRING
      },
      dispatch_contact_person: {
        type: Sequelize.STRING
      },
      dispatch_contact_person_no: {
        type: Sequelize.STRING
      },
      utilize_advance_amount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
      },

      ///////////////////////
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      }
    },

    {
      freezeTableName: true,
    }
  );
  return addInvoice;
};