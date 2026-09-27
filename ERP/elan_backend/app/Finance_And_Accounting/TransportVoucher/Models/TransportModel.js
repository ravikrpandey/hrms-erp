module.exports = (sequelize, Sequelize) => {
    const transportVoucher = sequelize.define('TRANSPORT_VOUCHER', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }, 
      date: {
        type: Sequelize.DATEONLY, 
      },
      Address: {
        type: Sequelize.STRING, 
      },
      bill_invoice_number: {
        type: Sequelize.STRING,
      },
      GSTIN:{
        type: Sequelize.STRING,
      },
      sac_code: {
        type: Sequelize.STRING, 
      },
      rcm_check: {
        type: Sequelize.STRING, 
      },
     gross_total: {
        type: Sequelize.DECIMAL(20,4), 
      },
       total_tds: {
        type: Sequelize.DECIMAL(20,4), 
      }, 
      grand_total: {
        type: Sequelize.DECIMAL(20,4),  
      },
      
      gst_total:{
        type: Sequelize.DECIMAL(20,4),  
      },
      igst:{
        type: Sequelize.DECIMAL(20,4),  
      },
      cgst:{
        type: Sequelize.DECIMAL(20,2),  
      },
      sgst:{
        type: Sequelize.DECIMAL(20,2),  
      },
      less_value:{
        type: Sequelize.DECIMAL(20,4),  
      },
      currency_rate:{
        type: Sequelize.DECIMAL(20,5),  
      },
      is_round_off:{
        type: Sequelize.BOOLEAN,  
      },
      round_off:{
        type: Sequelize.DECIMAL(20,4),  
      },
      rounded_payable_amount:{
        type: Sequelize.DECIMAL(20,5),  
      }
      },
      {
        freezeTableName: true,
      }
    );
    return transportVoucher;
};
  