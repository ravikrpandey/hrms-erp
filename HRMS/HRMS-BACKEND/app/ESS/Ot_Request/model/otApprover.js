module.exports = (sequelize, Sequelize) => {
    const overtime_Approver= sequelize.define("ESS_OVERTIME_APPROVER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
     
        approver_remark: {
            type: Sequelize.TEXT,
        },
        level: {
            type: Sequelize.INTEGER,
        },
        approval_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED","REJECTED"),
            defaultValue: "PENDING",
            allowNull: true
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
        })
        ;
    return overtime_Approver;
};
