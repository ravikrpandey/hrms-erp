module.exports = (sequelize, Sequelize) => {
    const helpDeskDetails = sequelize.define("ESS_HELP_DESK", {
        employee_helpDesk_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        requester: {
            type: Sequelize.STRING
        },
        requester_name:{
            type: Sequelize.STRING
        },
        subject: {
            type: Sequelize.STRING
        },
        assignee: {
            type: Sequelize.STRING
        },
        field_title: {
            type: Sequelize.STRING
        },
        request_for: {
            type: Sequelize.STRING
        },
        priority: {
            type: Sequelize.STRING
        },
        type_of_document: {
            type: Sequelize.STRING
        },
        request_no: {
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM,
            values : ["ACTIVE", "INACTIVE"],
            defaultValue: "ACTIVE",
            allowNull: true
          },
          status1:{
            type : Sequelize.STRING
          },
        employee_id: {
            type: Sequelize.INTEGER
        }
    },
    {
      freezeTableName: true,
    });
    return helpDeskDetails;
};
