
module.exports = (sequelize, Sequelize) => {
    const ktassignment = sequelize.define("KT_ASSIGNMENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        created_date:{
            type:Sequelize.DATEONLY()
        },
        remarks: {
            type: Sequelize.TEXT
        },
        approval_status: {
            type: Sequelize.ENUM("PENDING", "COMPLETE", "REJECTED"),
            defaultValue: "PENDING"
        },
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