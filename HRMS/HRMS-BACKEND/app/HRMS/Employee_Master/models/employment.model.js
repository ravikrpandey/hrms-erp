module.exports = (sequelize, Sequelize) => {
    const EmploymentType = sequelize.define("HRMS_EMPLOYMENT_TYPE", { 
      emptype_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      emptype_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },  
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      isDeleted :{
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      },
      filter_status:{
        type: Sequelize.STRING,
        defaultValue:"HRMS"
      }
    },

    {
      freezeTableName: true,
    },  {
      timestamps: true,
    },);

    return EmploymentType;
  };