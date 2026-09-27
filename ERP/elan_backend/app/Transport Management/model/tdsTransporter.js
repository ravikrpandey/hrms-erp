module.exports = (sequelize, Sequelize) => {
    const transporterTds = sequelize.define("TRANSPORTER_TDS_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
       
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
        },
        {
            freezeTableName: true,
        });
    return transporterTds;
};
