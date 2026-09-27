
module.exports = (sequelize, Sequelize) => {
    const purchaseServiceVoucher = sequelize.define('PURCHASE_SERVICE_VOUCHER', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      document_number:{
        type: Sequelize.STRING,
      },
      posting_date: {
        type: Sequelize.DATEONLY, 
      },
      transaction_date: {
        type: Sequelize.DATEONLY, 
      },
      party_type: {
        type: Sequelize.STRING, 
      },
      notes: {
        type: Sequelize.STRING,
      },
      reference_number:{
        type: Sequelize.STRING,
      },
      
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
      isDeleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
      },
      document_type:{
        type: Sequelize.STRING,
      }, 

      currency_rate: {
        type: Sequelize.DECIMAL(20,5),                   
      },  
      less_amt: {
        type: Sequelize.DECIMAL(20,2),                   
      },
       taxable: {
        type: Sequelize.DECIMAL(20,2),                   
      },
      cgst: {
        type: Sequelize.DECIMAL(20,2), 
      },
      sgst: {
        type: Sequelize.DECIMAL(20,2), 
      },
      igst: {
        type: Sequelize.DECIMAL(20,2), 
      },
      gstTotal: {
        type: Sequelize.DECIMAL(20,2), 
      },
       gross: {
        type: Sequelize.DECIMAL(20,2), 
      },
       net: {
        type: Sequelize.DECIMAL(20,2), 
      },
      tdsAmt: {
        type: Sequelize.DECIMAL(20,2), 
      },
       rcmLiability: {
        type: Sequelize.DECIMAL(20,2), 
      },
      branch_id:{
        type:Sequelize.INTEGER
      },
      vendor_id:{
        type:Sequelize.INTEGER
      },
      entity_id:{
        type:Sequelize.INTEGER
      },
      tds_id:{
        type:Sequelize.INTEGER
      },
      nature_id:{
        type:Sequelize.INTEGER
      },
      voucher_list_id:{
        type:Sequelize.INTEGER
      }, 
      billing_id:{
        type:Sequelize.INTEGER
      },
 
      },
      {
        freezeTableName: true,
      }
    );
    purchaseServiceVoucher.associate = (db) => {
        transportVoucher.belongsTo(db.tbl_branch, {
          foreignKey: "branch_id",
          onDelete: "RESTRICT",
        });
    
        purchaseServiceVoucher.belongsTo(db.vendor_basic_details, {
          foreignKey: "vendor_id",
          onDelete: "RESTRICT",
        });
        purchaseServiceVoucher.belongsTo(db.entityMaster, {
          foreignKey: "entity_id",
          onDelete: "RESTRICT",
        });
        purchaseServiceVoucher.belongsTo(db.tds, {
            foreignKey: "tds_id",
            onDelete: "RESTRICT",
          });
          purchaseServiceVoucher.belongsTo(db.tdsList, {
            foreignKey: "nature_id",
            onDelete: "RESTRICT",
          });
          purchaseServiceVoucher.belongsTo(db.voucherMainList, {
            foreignKey: "voucher_list_id",
            onDelete: "RESTRICT",
          });
          purchaseServiceVoucher.belongsTo(db.billingData, {
            foreignKey: "billing_id",
            onDelete: "RESTRICT",
          });
       
      };

    return purchaseServiceVoucher;
};
  