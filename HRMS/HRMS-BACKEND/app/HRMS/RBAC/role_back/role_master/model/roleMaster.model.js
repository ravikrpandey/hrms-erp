module.exports = (sequelize, Sequelize) => {
    const roleMasterDetails = sequelize.define("HRMS_RBAC_ROLE_MASTER", {
        role_master_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role_master_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE" , "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull :true
          }, 
 
    },
    {
      freezeTableName: true,
    });
    return roleMasterDetails;
};