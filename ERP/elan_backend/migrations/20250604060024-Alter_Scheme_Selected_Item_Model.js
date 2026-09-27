'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'MASTER_SCHEME_SELECTED_ITEM';

    await queryInterface.addColumn(tableName, 'price_scheme', {
      type: Sequelize.DECIMAL(50, 0), // Fixed typo here
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