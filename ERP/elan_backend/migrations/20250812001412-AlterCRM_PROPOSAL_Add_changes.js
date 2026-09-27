'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "delivery_term_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "CRM_DELIVERY_TERM_AND_UNLOADING",
        key: "id",
      },
    });
     await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "unloading_resp_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "CRM_DELIVERY_TERM_AND_UNLOADING",
        key: "id",
      },
    });
     await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "payment_main_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "CRM_PAYMENT_MAIN_MST",
        key: "id",
      },
    });
     await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "sub_payment_main_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "CRM_SUB_PAYMENT_MAIN_MST",
        key: "id",
      },
    });
     await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "freight_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "CRM_FREIGHT_MST",
        key: "id",
      },
    });
  return await queryInterface.addColumn("CRM_CREATE_PROPOSAL_MST", "insurance_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "CRM_INSURANCE_MST",
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
