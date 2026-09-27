'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'CRM_PROPOSAL_SCHEME_TYPE';

    
    

    await queryInterface.addColumn(tableName, 'select_scheme', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
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
