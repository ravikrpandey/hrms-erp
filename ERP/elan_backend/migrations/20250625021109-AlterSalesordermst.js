'use strict';
const db = require("../app/models");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('SALES_ORDER_MST', 'version_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model:'CRM_VERSION_PROPOSAL_MST' , 
        key: 'id'
      },
      onDelete: 'RESTRICT'
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
