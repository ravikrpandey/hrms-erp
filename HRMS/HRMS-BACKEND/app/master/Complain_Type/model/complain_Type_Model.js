module.exports = (sequelize, Sequelize) => {
    const Master_Complaint = sequelize.define("MASTER_COMPLAINT_TYPE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        complaint_type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        complaint_code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },

        {
            freezeTableName: true,
        })
        ;
    return Master_Complaint;
};
