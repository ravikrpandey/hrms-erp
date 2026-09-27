module.exports = (sequelize, Sequelize) => {
    const dealClose = sequelize.define(
      "CRM_PROPOSAL_DEAL_CLOSE_MST",
      {
        id: {
          type: Sequelize.INTEGER, 
          primaryKey: true,
          autoIncrement: true,
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        freezeTableName: true,
      }
    );
    return dealClose;
  };
  