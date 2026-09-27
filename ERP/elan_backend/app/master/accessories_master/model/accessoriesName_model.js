module.exports = (sequelize, Sequelize) => {
    const accessories_mst_name = sequelize.define("MASTER_ACCESSORIES_NAME", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        accessories_name: {
            type: Sequelize.STRING
        },
        accessories_discount: {
            type: Sequelize.INTEGER
        },
        accessories_price: {
            type: Sequelize.INTEGER
        },
        accessories_doc: {
            type: Sequelize.STRING
        },
        fitment_qty: {
            type: Sequelize.INTEGER
        },
        removal_qty: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return accessories_mst_name;
}