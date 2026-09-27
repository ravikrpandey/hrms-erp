module.exports = (sequelize, Sequelize) => {
    const bankPaymentVoucher = sequelize.define("BANK_PAYMENT_VOUCHER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        voucher_name: {
            type: Sequelize.STRING,
             
        },
        voucher_series: {
            type: Sequelize.STRING
        },
        isDeleted:{
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
         
    },
    
    {
      freezeTableName: true,
    });
    return bankPaymentVoucher
}