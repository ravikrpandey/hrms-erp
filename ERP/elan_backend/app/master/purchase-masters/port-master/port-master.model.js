module.exports = (sequelize, Sequelize) => {
    const portMaster = sequelize.define("MASTER_PORT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        port_name: {
            type: Sequelize.STRING
        },
        unlocode: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        port_type: {
            type: Sequelize.STRING
        },
        latitude: {
            type: Sequelize.STRING
        },
        longitude: {
            type: Sequelize.STRING
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },

        {
            freezeTableName: true,
        });
    return portMaster;
}