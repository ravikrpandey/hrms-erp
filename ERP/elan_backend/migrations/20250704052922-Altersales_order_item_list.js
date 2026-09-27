"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      "SALES_ORDER_ITEM_LIST",
      "customization_type_id",
      {
        type: Sequelize.INTEGER,
        references: {
          model: "CRM_PROPOSAL_CUSTOMISATION_TYPE",
          key: "id",
        },
      }
    );
    await queryInterface.addColumn(
      "SALES_ORDER_ITEM_LIST",
      "branding_data_id",
      {
        type: Sequelize.INTEGER,
        references: {
          model: "CRM_PROPOSAL_BRANDING",
          key: "id",
        },
      }
    );
    await queryInterface.addColumn(
      "SALES_ORDER_ITEM_LIST",
      "gst_type",
      {
        type: Sequelize.ENUM("URP", "RP"),
        defaultValue: "URP",
      }
    );
    await queryInterface.addColumn(
      "SALES_ORDER_ITEM_LIST",
      "gst_no",
      {
        type: Sequelize.TEXT,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
