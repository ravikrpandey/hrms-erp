module.exports = (sequelize, Sequelize) => {
    const read_write_access = sequelize.define("HRMS_RBAC_READ_WRITE_ACCESS", {
        read_write_access_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role_master_id:{
          type: Sequelize.INTEGER,

        },
        employee_id:{
            type: Sequelize.INTEGER,
        },
        role_module_master_id: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
      
        menu_master_id: {
            type: Sequelize.INTEGER,
            defaultValue: 0

        },
        
        submenu_master_id: {
            type: Sequelize.INTEGER
        },
     
        forAll: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        forSingle: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        Write: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: true
        },
        Read: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: true
        },
        Delete: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: true
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },

    },
    {
      freezeTableName: true,
    });
    return read_write_access;
};