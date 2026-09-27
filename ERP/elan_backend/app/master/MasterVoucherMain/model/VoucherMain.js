module.exports = (sequelize, Sequelize) => {
    const voucherMain = sequelize.define("SYS_VOUCHER_MAIN_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
             
        },
        isDeleted:{
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
         
    },
    
    {
      freezeTableName: true,
    });
    return voucherMain
}