module.exports = (sequelize, Sequelize) => {
    const purchase_vendor = sequelize.define("PROCUREMENT_PURCHASE_REQUEST_VENDOR", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    },
        {
            freezeTableName: true,
            timestamps: false
        });
    return purchase_vendor;
};
