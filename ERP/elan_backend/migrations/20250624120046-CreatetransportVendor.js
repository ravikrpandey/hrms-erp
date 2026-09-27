'use strict';
const db = require("../app/models");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const result = global.extractModelFields(db.transportVendor);
    await queryInterface.createTable(result.modelName, result.fields);
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
