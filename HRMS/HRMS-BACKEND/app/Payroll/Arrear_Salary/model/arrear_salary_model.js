module.exports = (sequelize, Sequelize) => {
    const arrear_salary = sequelize.define(
        "PAYROLL_ARREAR_SALARY",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            arrear_type: {
                type: Sequelize.ENUM("INCREMENT", "CORRECTION", "MANUAL"),
                defaultValue: "INCREMENT",
            },
            month: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 12,
                },
            },
            start_arrear_date: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            end_arrear_date: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
            },
            is_epf_applicable: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_esi_applicable: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_taxable: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            remark: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
                defaultValue: "ACTIVE",
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );

    return arrear_salary;
};
