module.exports = (sequelize, Sequelize) => {
    const maritalStatusData = sequelize.define("HRMS_MARITAL_STATUS", { 
  
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        
      },
      gender:{
        type:Sequelize.ENUM,
        values:['male','female'],
        
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'ACTIVE'
      }
    },
    {
      freezeTableName: true,
    });
  
  
    return maritalStatusData;
  };