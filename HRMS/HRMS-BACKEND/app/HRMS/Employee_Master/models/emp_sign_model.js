module.exports = (sequelize, Sequelize) => {
    const emp_sign_data = sequelize.define("HRMS_EMPLOYEE_SIGNATURE", { 
        signature_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        employee_id: {
            type: Sequelize.STRING
        },
        emp_signature: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },

    },
    {
      freezeTableName: true,
    })
    return emp_sign_data;
};