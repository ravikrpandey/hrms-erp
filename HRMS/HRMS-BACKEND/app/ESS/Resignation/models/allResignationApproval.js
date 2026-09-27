module.exports = (sequelize, Sequelize) => {
    const All_Resignation_approval = sequelize.define("ESS_All_RESIGNATION_APPROVEL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name:{
            type: Sequelize.TEXT
        },
        employee_number: {
            type: Sequelize.TEXT
        },
        reporting_manager: {
            type: Sequelize.TEXT
        },
        // review: {
        //     type: Sequelize.TEXT
        // },
        // comments: {
        //     type: Sequelize.TEXT
        // },
        // checklist_remark: {
        //     type: Sequelize.TEXT
        // },
        reporting_manager_id:{
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("PENDING", "APPROVED"),
            defaultValue: "PENDING"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true
        });
    return All_Resignation_approval
}