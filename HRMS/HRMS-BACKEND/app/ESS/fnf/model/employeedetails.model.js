
module.exports = (sequelize, Sequelize) => {
    const fnf_employee_details = sequelize.define("FNF_EMPLOYEE_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        employee_name:{
            type: Sequelize.TEXT
        },
        department: {
            type: Sequelize.TEXT
        },
        designation: {
            type: Sequelize.TEXT
        },
      
        date_of_joining:{
            type: Sequelize.DATEONLY
        },
         last_working_date:{
            type: Sequelize.DATEONLY
        },
          resignation_type:{
            type: Sequelize.ENUM("VOLUNTARY", "RETREMENT")
        },
        fnf_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED","PAID"),
            defaultValue: "PENDING"
        },  
    },
        {
            freezeTableName: true
        });
    return fnf_employee_details
}