
module.exports = (sequelize, Sequelize) => {
    const ktassignment = sequelize.define("KT_ASSIGNMENT_EMPLOYEE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        emp_approval_status: {
            type: Sequelize.ENUM("PENDING", "COMPLETE", "REJECTED"),
            defaultValue: "PENDING"
        },
        approval_remark: {
            type: Sequelize.TEXT, 
        },
        // approved_date: {
        //     type: Sequelize.DATEONLY(), 
        // },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        }
    },
        {
            freezeTableName: true,
        }
    )
    return ktassignment;
}