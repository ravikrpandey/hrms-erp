module.exports = (sequelize, Sequelize) => {
    const asset_master = sequelize.define("ASSET_MASTER", {
        asset_master_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        asset_master_name: {
            type: Sequelize.STRING
        },
        brand: {
            type: Sequelize.STRING
        },
        model: {
            type: Sequelize.STRING
        },
        serial_no: {
            type: Sequelize.INTEGER,
        },
        purchase_date: {
            type: Sequelize.DATEONLY(),
            allowNull: true,
        },
        purchase_cost: {
            type: Sequelize.DECIMAL(20, 2),
            allowNull: false,
        },
        current_status: {
            type: Sequelize.ENUM("AVAILABLE", "ASSIGNED", "REPAIR", "SCRAP"),
            defaultValue: "AVAILABLE",
        },
        warranty_end_date: {
            type: Sequelize.DATEONLY(),
            allowNull: true,
        },
        remark: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
    },
        {
            freezeTableName: true
        }
    );

    return asset_master;
};
