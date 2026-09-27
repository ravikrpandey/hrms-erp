'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "created_by", {
      type: Sequelize.ENUM("Self", "Any Other"),
      defaultValue: "Self",
    });
    await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "delivery_term_remark", {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "unloading_resp_remark", {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "warranty_month_remark", {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "warranty_month", {
      type: Sequelize.STRING
    });





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
