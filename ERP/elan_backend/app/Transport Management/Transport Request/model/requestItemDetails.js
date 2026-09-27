module.exports = (sequelize, Sequelize) => {
    const transItemDetail = sequelize.define("TRANSPORT_REQUEST_ITEM_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        asset_id: {
            type: Sequelize.INTEGER,
        },
        item_type_id: {
            type: Sequelize.INTEGER,
        },
        item_master_id: {
            type: Sequelize.INTEGER,
        },
        bom_qty: {
            type: Sequelize.INTEGER,
        },
        item_code: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        // uom_id: {
        //     type: Sequelize.INTEGER
        // },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });

    return transItemDetail;
};
