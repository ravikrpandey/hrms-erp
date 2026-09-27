module.exports = (sequelize, Sequelize) => {
    const expense_request = sequelize.define("EXPENSE_REQUEST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        expense_request_number: {
            type: Sequelize.STRING
        },
        expense_request_type: {
            type: Sequelize.ENUM(
                'Indirect_Expense',
                'Reimbursement_Expense',
                'Other_Expense' // Only Indirect and Other Expense types
            ),
            defaultValue: 'Indirect_Expense' // Set default to Indirect Expense
        },
        current_date: {
            type: Sequelize.DATEONLY('DD-MM-YYYY')
        },
        advance_amount: {
            type: Sequelize.DECIMAL(12, 2)
        },
        expense_final_status: {
            type: Sequelize.ENUM("DRAFT", "PENDING", "APPROVED", "REJECTED"),
            defaultValue: "DRAFT"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE", "ALLOCATED"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        freezeTableName: true,
    });

    return expense_request;
};
