module.exports = (sequelize, Sequelize) => {
    const kt_master = sequelize.define("KNOWLEDGE_TRANSFER_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        category_name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
    },
        {
            freezeTableName: true
        }
    );

    return kt_master;
};
