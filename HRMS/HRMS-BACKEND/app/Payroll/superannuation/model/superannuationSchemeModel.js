module.exports = (sequelize, Sequelize) => {
    const superannuationScheme = sequelize.define("PAYROLL_SUPERANNUATION_DATA", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        schemeName:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        accountNo: {
            type: Sequelize.
                STRING, allowNull: false
        },
        employerContribution: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        employeeContribution: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        vestingPeriod: {
            type: Sequelize.STRING,
            allowNull: false
        },
        cliffYears: {
            type: Sequelize.INTEGER
        },
        gradedPercent: {
            type: Sequelize.FLOAT
        },
        gradedYears: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
    },
        {
            freezeTableName: true,
        }

    );
    return superannuationScheme;
};
