'use strict';


const db = require("../app/models");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const result = global.extractModelFields(db.paymentMainCategory);
          await queryInterface.createTable(result.modelName, result.fields);
    

        //   return  await queryInterface.addColumn("CRM_SUB_PAYMENT_MAIN_MST", "payment_main_id", {
        //     type: Sequelize.INTEGER,
        //     references: {
        //       model: "CRM_PAYMENT_MAIN_MST",
        //       key: "id",
        //     },
        //   },
          
        // );
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
