module.exports = (sequelize, Sequelize) => {
    const signatureDetails = sequelize.define("DIGITAL_SIGNATURE", {
        digital_signature_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        employee_id: {
            type: Sequelize.INTEGER
        },
        employee_name: {
            type: Sequelize.STRING
        },
        department_id: {
            type: Sequelize.INTEGER
        },
        digital_signature: {
            type: Sequelize.STRING
        }, 
         remark: {
            type: Sequelize.STRING
        },      
        status: {
            type: Sequelize.ENUM("Pending", "Approved", "Rejected","Resubmit"),
            defaultValue: "Pending"
        },
          isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },  {
      freezeTableName: true,
    });
    return signatureDetails;
}