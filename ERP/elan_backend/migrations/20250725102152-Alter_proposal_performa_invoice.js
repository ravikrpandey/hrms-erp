'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {


    await queryInterface.addColumn(
      "PROPOSAL_PERFORMA_INVOICE",
      "sales_reason_id",
      {
        type: Sequelize.INTEGER,
        references: {
          model: "MASTER_SALES_REASON",
          key: "id",
        },
      }
    );
    await queryInterface.addColumn(
      "PROPOSAL_PERFORMA_INVOICE",
      "reason_rejectedBy",
      {
        type: Sequelize.INTEGER,
        references: {
          model: "HRMS_REGISTERED_USER",
          key: "id",
        },
      }
    );
    await queryInterface.addColumn(
      "PROPOSAL_PERFORMA_INVOICE",
      "reason_remarks",
      {
        type: Sequelize.STRING,

      }
    );

    return await queryInterface.addColumn(
      "PROPOSAL_PERFORMA_INVOICE",
      "back_office_rejected",
      {
        type: Sequelize.BOOLEAN,


      }
    );

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
