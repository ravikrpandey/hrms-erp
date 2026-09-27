module.exports = (sequelize, Sequelize) => {
    const grnPrmotionalItem = sequelize.define("PROMOTIONAL_GRN_ITEM", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        total_mvp: {
            type: Sequelize.DECIMAL(20,2),
        },
        tax: {
            type: Sequelize.DECIMAL(20,2),
        },
        discount: {
            type: Sequelize.DECIMAL(20,2),
        },
        quantity: {
            type: Sequelize.INTEGER,
        },
        unit_price: {
            type: Sequelize.DECIMAL(20,2),
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        batch_number:{
            type: Sequelize.STRING,
            allowNull: true
        }
       
    },
        {
            freezeTableName: true,
        });
    return grnPrmotionalItem;
};
