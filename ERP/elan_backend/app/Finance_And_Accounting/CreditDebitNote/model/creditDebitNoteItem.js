const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const creditDebitNoteItem = sequelize.define(
      "FINANCE_CREDIT_DEBIT_NOTE_ITEM",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        total_with_gst:{
            type: Sequelize.DECIMAL(20,2)
        },
        quantity:{
            type: Sequelize.INTEGER
        },
        price_per_unit:{
            type: Sequelize.INTEGER
        },
        total_discount_amount:{
          type: Sequelize.DECIMAL(20,2)
        },
        total_price:{
          type: Sequelize.DECIMAL(20,2)
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
          defaultValue: "ACTIVE",
        },
        credit_debit_note_id: {
            type: Sequelize.INTEGER,
          }, 
          product_master_id: {
            type: Sequelize.INTEGER,
          },
      },
      {
        freezeTableName: true,
      }
    )
    db.ItemMaster
   
    creditDebitNoteItem.associate = (db) => {
        creditDebitNoteItem.belongsTo(db.creditDebitNote, {
          foreignKey: "credit_debit_note_id",
          onDelete: "RESTRICT",
        });
    
        creditDebitNoteItem.belongsTo(db.ItemMaster, {
          foreignKey: "product_master_id",
          onDelete: "RESTRICT",
        });
       
    
      };
    return creditDebitNoteItem;
  };
  