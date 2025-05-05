'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Waybills', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      layoutId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      carType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      repeating: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      rareWaybill: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      currentSequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Waybills');
  }
};
