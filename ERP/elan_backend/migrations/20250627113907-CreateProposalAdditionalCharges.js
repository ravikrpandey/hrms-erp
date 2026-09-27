'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.addColumn("CRM_PROPOSAL_ADDTIONAL_LIST_MST", "charge_name_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "CRM_PROPOSAL_ADDTIONAL_LIST_MST",
        key: "id",
      },
    });
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
