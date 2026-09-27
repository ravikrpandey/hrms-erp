'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "PROPOSAL_PERFORMA_INVOICE",
      "version_reason_id",
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
      "version_rejected_by",
      {
        type: Sequelize.INTEGER,
        references: {
          model: "HRMS_REGISTERED_USER",
          key: "employee_id",
        },
      }
    );
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
