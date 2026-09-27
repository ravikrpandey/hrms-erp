
module.exports = (sequelize, Sequelize) => {
    const fnf_Summary_details = sequelize.define("FNF_SUMMARY_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        total_earnings: {
            type: Sequelize.TEXT
        },
        total_deductions: {
            type: Sequelize.TEXT
        },
        net_fnf_payable: {
            type: Sequelize.TEXT
        },

        tds_tax_deductions: {
            type: Sequelize.INTEGER
        },
        final_amount_payable: {
            type: Sequelize.INTEGER
        },
        hr_approval: {
            type: Sequelize.ENUM("PENDING", "APPROVED"),
            defaultValue: "PENDING"
        },
        hr_approval_date: {
            type: Sequelize.DATEONLY
        },
        finance_approval: {
            type: Sequelize.ENUM("PENDING", "APPROVED",),
            defaultValue: "PENDING"
        },
        comments: {
            type: Sequelize.TEXT
        },
        audit_log: {
            type: Sequelize.TEXT
        },

    },
        {
            freezeTableName: true
        });
    return fnf_Summary_details
}