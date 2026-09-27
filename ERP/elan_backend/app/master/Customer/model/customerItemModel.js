const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const customer_item_list = sequelize.define(
    "CUSTOMER_ITEM_LIST",

    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_qty: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      gst: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      discount: {
        type: Sequelize.INTEGER,
        defaultValue: null,
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
      proposal_no:{
        type:Sequelize.TEXT,
      },
      promo_order_qty: {
        type: Sequelize.INTEGER
       
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      },
    },
    {
      freezeTableName: true,
    }
  );
  return customer_item_list;
};