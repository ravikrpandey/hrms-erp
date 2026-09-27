module.exports = (sequelize, Sequelize) => {
    const EarningTypeModel = sequelize.define('MASTER_EARNING_TYPE', {
        earning_type_name: {
            type: Sequelize.STRING,
        },
        earning_type_code: {
            type: Sequelize.STRING
        },
        entity_type: {
            type: Sequelize.INTEGER,
        },
        financial_year: {
            type: Sequelize.INTEGER
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM('Active', 'Inactive'),
            defaultValue: 'Active'
        },
    },
    {
    freezeTableName: true
}) 
return EarningTypeModel;
};