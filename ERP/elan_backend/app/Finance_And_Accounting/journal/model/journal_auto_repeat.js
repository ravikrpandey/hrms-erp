module.exports = (sequelize, Sequelize) => {
    const financialAccountJournalSchedule = sequelize.define(
      "FINANCIAL_AND_ACCOUNT_JOURNAL_SCHEDULE",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
          frequency_type: {
          type: Sequelize.STRING,
          allowNull: true,
        },  
        scheduled_date: {
          type: Sequelize.DATEONLY, 
            allowNull: true
        },
        start_date: {
            type: Sequelize.DATEONLY, 
              allowNull: true
        },
        end_date: {
            type: Sequelize.DATEONLY, 
              allowNull: true
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
          defaultValue: "ACTIVE",
        },
        isDeleted: {
          type: Sequelize.BOOLEAN(true, false),
          defaultValue: false,
        }
      },
      {
        freezeTableName: true,
      }
    );
  
    return financialAccountJournalSchedule;
  };
  