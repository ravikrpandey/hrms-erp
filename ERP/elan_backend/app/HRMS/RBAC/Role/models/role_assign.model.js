module.exports = (sequelize, Sequelize) => {
    const RoleAssign = sequelize.define("HRMS_RBAC_ROLE_ASSIGN", {  //role_assign
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_id: {
        type: Sequelize.STRING
    },
    employee_id: {
        type: Sequelize.STRING
    },
    role_name: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
    },
},
{
  freezeTableName: true,
});
  
    return RoleAssign;
  };