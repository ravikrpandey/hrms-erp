
module.exports = (sequelize, Sequelize) => {
    const creditDebitNote = sequelize.define(
      "FINANCE_CREDIT_DEBIT_NOTE",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        amount: {
          type: Sequelize.DECIMAL(20, 2),
        },
        currency_rate: {
          type: Sequelize.DECIMAL(20, 5),
        },
  
        upload_doc: {
          type: Sequelize.STRING,
        },
  
        builder_date: {
          type: Sequelize.DATEONLY,
        },
  
        document_number: {
          type: Sequelize.STRING,
        },
  
        note_type: {
          type: Sequelize.STRING,
        },
  
        remark: {
          type: Sequelize.STRING,
        },
  
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
          defaultValue: "ACTIVE",
        },
        customer_id: {
            type: Sequelize.INTEGER,
          },
    
          vendor_id: {
            type: Sequelize.INTEGER,
          },
          entity_id: {
            type: Sequelize.INTEGER,
          },
      },
      {
        freezeTableName: true,
      }
    );
  
    creditDebitNote.associate = (db) => {
      creditDebitNote.belongsTo(db.customerProfile, {
        foreignKey: "customer_id",
        onDelete: "RESTRICT",
      });
  
      creditDebitNote.belongsTo(db.vendor_basic_details, {
        foreignKey: "vendor_id",
        onDelete: "RESTRICT",
      });
      creditDebitNote.belongsTo(db.grnMaster, {
        foreignKey: "invoice_id",
        onDelete: "RESTRICT",
      });
      creditDebitNote.belongsTo(db.salesOrder, {
        foreignKey: "sales_invoice_id",
        onDelete: "RESTRICT",
      });
      creditDebitNote.belongsTo(db.entityMaster, {
        foreignKey: "entity_id",
        onDelete: "RESTRICT",
      });
    };
  
    return creditDebitNote;
  };