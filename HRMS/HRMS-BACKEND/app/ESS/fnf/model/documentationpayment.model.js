module.exports = (sequelize, Sequelize) => {
    const fnf_document_details = sequelize.define("FNF_DOCUMENT_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        payment_status:{
            type: Sequelize.ENUM("PENDING", "PROCESSING","PAID")
        },
        payment_date: {
            type: Sequelize.DATEONLY
        },
        payment_method: {
            type: Sequelize.ENUM("CHEQUE", "BANKTRANSFER","OTHER")
        },
      
        transaction_id:{
            type: Sequelize.STRING
        },
         remark:{
            type: Sequelize.TEXT
        },
    
    },
        {
            freezeTableName: true
        });
    return fnf_document_details
}