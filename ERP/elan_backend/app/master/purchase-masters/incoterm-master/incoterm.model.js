module.exports = (sequelize, Sequelize) => {
    const incotermMaster = sequelize.define("MASTER_INCOTERM", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        incoterm_code: {
            type: Sequelize.STRING
        },
        incoterm_meaning: {
            type: Sequelize.STRING
        },
        incoterm_responsibility: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },

        {
            freezeTableName: true,
        });
    return incotermMaster;
}