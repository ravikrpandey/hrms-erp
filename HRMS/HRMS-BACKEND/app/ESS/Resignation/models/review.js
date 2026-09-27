module.exports = (sequelize, Sequelize) => {
    const All_Resignation_review = sequelize.define("ESS_All_RESIGNATION_REVIEW", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        review: {
            type: Sequelize.TEXT
        },
        comment: {
            type: Sequelize.TEXT
        },
        checklist_remark: {
            type: Sequelize.TEXT
        },
        // employee_id:{
        //     type: Sequelize.INTEGER
        // },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true
        });
    return All_Resignation_review
}