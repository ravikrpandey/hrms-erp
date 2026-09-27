module.exports = (sequelize, Sequelize) => {
    const quotationApprovalLevel = sequelize.define("PROCUREMENT_PURCHASE_QUOTATION_APPROVAL_LEVEL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        level: {
            type: Sequelize.JSON
        },
        approval_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED"),
            defaultValue: "PENDING"
        },
        progress_status: {
            type: Sequelize.ENUM("OPEN", "CLOSE"),
            defaultValue: "OPEN"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        approval_for: {
            type: Sequelize.STRING
        }
    },
        {
            freezeTableName: true
        });
    return quotationApprovalLevel
}