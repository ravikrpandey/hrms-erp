module.exports = (sequelize, Sequelize) => {
    const user_contract = sequelize.define("HRMS_REGISTERED_USER_CONTRACT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        contract_types: {
            type: Sequelize.STRING,
        },
        start_working_date: {
            type: Sequelize.STRING,
        },
        end_date_probation: {
            type: Sequelize.STRING,
        },
        contract_types_id: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted :{
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
          },
    }, {
        freezeTableName: true
    });
    return user_contract;
};