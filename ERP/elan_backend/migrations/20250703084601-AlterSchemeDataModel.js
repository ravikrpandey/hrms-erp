'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = "CRM_PROPOSAL_BRANDING_SCHEME"

     await queryInterface.addColumn(tableName, "proposal_scheme_type_id", {
      type: Sequelize.INTEGER ,
       references: {
        model: "CRM_PROPOSAL_SCHEME_TYPE",
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
