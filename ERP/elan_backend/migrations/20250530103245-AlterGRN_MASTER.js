'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'GRN_MASTER';
    await queryInterface.addColumn(tableName, 'mltiple_data', {
      type: Sequelize.ENUM("yes", "no"),
      defaultValue: "no"
    });
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
