'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("CRM_PROPOSAL_LIST_MST", "discount1", {
      type: Sequelize.DECIMAL(20, 2),
    });
    await queryInterface.addColumn("CRM_PROPOSAL_LIST_MST", "discount2", {
      type: Sequelize.DECIMAL(20, 2),
    });
    await queryInterface.addColumn("CRM_PROPOSAL_LIST_MST", "discount2Mode", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("CRM_PROPOSAL_LIST_MST", "discount3", {
      type: Sequelize.DECIMAL(20, 2),
    });
    await queryInterface.addColumn("CRM_PROPOSAL_LIST_MST", "discount3Mode", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("CRM_PROPOSAL_LIST_MST", "min_price", {
      type: Sequelize.STRING,
    });
    
    await queryInterface.addColumn("CRM_PROPOSAL_BRANDING", "discount", {
      type: Sequelize.DECIMAL(20, 2),
    });
    await queryInterface.addColumn("CRM_PROPOSAL_BRANDING", "after_discount", {
      type: Sequelize.DECIMAL(20, 2),
    });
    await queryInterface.addColumn("CRM_PROPOSAL_BRANDING", "with_gst", {
      type: Sequelize.DECIMAL(20, 2),
    });    
    await queryInterface.addColumn("CRM_PROPOSAL_CUSTOMISATION_DATA", "discount", {
      type: Sequelize.DECIMAL(20, 2),
    });
    await queryInterface.addColumn("CRM_PROPOSAL_CUSTOMISATION_DATA", "after_discount", {
      type: Sequelize.DECIMAL(20, 2),
    });
    await queryInterface.addColumn("CRM_PROPOSAL_CUSTOMISATION_DATA", "with_gst", {
      type: Sequelize.DECIMAL(20, 2),
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
