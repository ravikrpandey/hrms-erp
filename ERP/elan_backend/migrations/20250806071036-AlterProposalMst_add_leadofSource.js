'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn("CRM_LEAD_SOURCE_MST", "entity_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "ENTITY_MASTER",
        key: "id",
      },
    });
   return  await queryInterface.addColumn("CRM_LEAD_SOURCE_MST", "financial_year_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "MASTER_FINANCIAL_YEAR",
        key: "id",
      },
    });
    /**
     * Add altering commands here.
     *
     * Example: financial_year_id
entity_id
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
