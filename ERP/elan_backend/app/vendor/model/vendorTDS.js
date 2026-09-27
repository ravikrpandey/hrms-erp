module.exports = (sequelize, Sequelize) => {
    const vendorTDS = sequelize.define("VENDOR_TDS_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        threshold_limit:{
            type: Sequelize.DECIMAL(20,0)
        },
        tds_rate:{
            type: Sequelize.DECIMAL(20,0)
        },
        

    },
        {
            freezeTableName: true,
        }
    );
    return vendorTDS;
};
