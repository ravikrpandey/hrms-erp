module.exports = (sequelize, Sequelize) => {
    const budgetPlanningApproval = sequelize.define("FINANCE_BUDGET_PLANNING_APPROVAL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        level: {
            type: Sequelize.JSON
        },
        approval_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING","REJECTED", "DRAFT"),
            defaultValue: "DRAFT"
        },
        remarks: {
            type: Sequelize.STRING
        },
        progress_status: {
            type: Sequelize.ENUM("OPEN", "CLOSE"),
            defaultValue: "OPEN"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true
        });
    return budgetPlanningApproval
}