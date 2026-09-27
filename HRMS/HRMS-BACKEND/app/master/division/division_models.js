module.exports = (sequelize, Sequelize) => {
    const division_master = sequelize.define("MASTER_DIVISION", {
        division_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        division_name: {
            type: Sequelize.STRING
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

    return division_master;
};
