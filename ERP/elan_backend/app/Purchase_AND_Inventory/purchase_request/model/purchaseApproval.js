module.exports = (sequelize, Sequelize) => {
    const procurement_approval = sequelize.define("PROCUREMENT_PURCHASE_REQUEST_APPROVAL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        level: {
            type: Sequelize.STRING
        },
        approvel_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED"),
            defaultValue: "PENDING"
        },
        progressStatus: {
            type: Sequelize.ENUM("OPEN", "CLOSE"),
            defaultValue: "OPEN"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        // final_quantity : {
        //     type: Sequelize.STRING
        // },
        // final_MVP : {
        //     type: Sequelize.STRING
        // },
        workflow_type: {
            type: Sequelize.STRING
        },
        remark: {
            type: Sequelize.TEXT
        }
    },
        {
            freezeTableName: true
        });
    return procurement_approval
}