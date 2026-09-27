module.exports = (sequelize, Sequelize) => {
    const voucherMaster = sequelize.define("VOUCHER_MASTER", {
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
    return voucherMaster
}