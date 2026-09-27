module.exports = (sequelize, Sequelize) => {
    const EmployerContributionRateSchema = sequelize.define("MASTER_EMPLOYER_CONTRIBUTION_RATE", {
        emplr_contribution_rate_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        contribution_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contribution_rate: {
            type: Sequelize.STRING,
            allowNull: false
        },
        effective_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        effective_end_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, 
    {
        freezeTableName: true,
    });

    return EmployerContributionRateSchema;
};
