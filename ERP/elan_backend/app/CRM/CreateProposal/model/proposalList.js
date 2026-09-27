const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const proposalList = sequelize.define(
    "CRM_PROPOSAL_LIST_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      qty: {
        type: Sequelize.INTEGER
      },
      price_per_unit: {
        type: Sequelize.DECIMAL(20, 2),
      },
      calculated_price: {
        type: Sequelize.DECIMAL(20, 2),
      },
      cgst: {
        type: Sequelize.FLOAT,
      },
      sgst: {
        type: Sequelize.FLOAT
      },
      igst: {
        type: Sequelize.FLOAT
      },
      gst_type: {
        type: Sequelize.STRING,
      },
      discount_request: {
        type: Sequelize.FLOAT
      },
      discount_approved: {
        type: Sequelize.FLOAT
      },
      maximum_discount: {
        type: Sequelize.FLOAT
      },
      approvel_status: {
        type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED", "FORWARD"),
        defaultValue: "PENDING"
      },
      select_scheme: {
        type: Sequelize.JSON,
      },
      apply_scheme: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      promo_item: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      new_item: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      action_type: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      },
      discount1Mode: {
        type: Sequelize.STRING,
      },
      discount1: {
        type: Sequelize.DECIMAL(20, 2),
      },
      discount1Flat: {
        type: Sequelize.DECIMAL(20, 2),
      },
      flatPercentage1: {
        type: Sequelize.DECIMAL(20, 2),
      },
      discount2Mode: {
        type: Sequelize.STRING,
      }, 
      discount2: {
        type: Sequelize.DECIMAL(20, 2),
      },
      discount2Flat: {
        type: Sequelize.DECIMAL(20, 2),
      },
      flatPercentage2: {
        type: Sequelize.DECIMAL(20, 2),
      },
      discount3Mode: {
        type: Sequelize.STRING,
      },  
      discount3: {
        type: Sequelize.DECIMAL(20, 2),
      },
      discount3Flat: {
        type: Sequelize.DECIMAL(20, 2),
      },
      flatPercentage3: {
        type: Sequelize.DECIMAL(20, 2),
      },
      min_price: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalPrice: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalWithGst: {
        type: Sequelize.DECIMAL(20, 2),
      },
      dbp: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalDiscountAmount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalDiscountAmountPerQTY: {
        type: Sequelize.DECIMAL(20, 2),
      },
      warranty: {
        type: Sequelize.STRING,
      },
    },

    {
      freezeTableName: true,
    }
  );
  return proposalList;
};