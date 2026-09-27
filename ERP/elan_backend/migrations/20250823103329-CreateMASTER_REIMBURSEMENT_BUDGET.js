'use strict';

/** @type {import('sequelize-cli').Migration} */
const db = require("../app/models");
module.exports = {
  async up(queryInterface, Sequelize) {
    const result = global.extractModelFields(db.MASTER_REIMBURSEMENT_BUDGET);
    await queryInterface.createTable(result.modelName, result.fields);
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
