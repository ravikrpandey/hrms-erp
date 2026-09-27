module.exports = (sequelize, Sequelize) => {
    const voucherMainList = sequelize.define("VOUCHER_MAIN_LIST_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        voucher_name: {
            type: Sequelize.STRING,
             
        },
        series: {
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
    return voucherMainList
}