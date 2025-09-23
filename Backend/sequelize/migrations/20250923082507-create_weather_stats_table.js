'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'weather_stats',
        {
          id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
          external_id: { type: Sequelize.STRING, allowNull: false },
          place: {type: Sequelize.STRING, allowNull: false},
          mag: { type: Sequelize.FLOAT, allowNull: false, defaultValue:0},
          time: {type: Sequelize.DATE, allowNull: false},
          updated: { type: Sequelize.DATE, allowNull: false},
          tz: { type: Sequelize.INTEGER, allowNull: true, defaultValue:0},
          url: { type: Sequelize.STRING, allowNull: true},
          detail: { type: Sequelize.STRING, allowNull: true},
          felt: { type: Sequelize.INTEGER, allowNull: true, defaultValue:0},
          cdi: { type: Sequelize.FLOAT, allowNull: true, defaultValue:0},
          mmi: { type: Sequelize.FLOAT, allowNull: true, defaultValue:0},
          alert: { type: Sequelize.STRING, allowNull: true},
          status: { type: Sequelize.STRING, allowNull: true},
          tsunami: { type: Sequelize.INTEGER, allowNull: true, defaultValue:0},
          sig: { type: Sequelize.INTEGER, allowNull: true, defaultValue:0},
          net: { type: Sequelize.STRING, allowNull: true},
          code: { type: Sequelize.STRING, allowNull: true},
          sources: { type: Sequelize.TEXT, allowNull: true},
          types: { type: Sequelize.TEXT, allowNull: true},
          nst: { type: Sequelize.INTEGER, allowNull: true, defaultValue:0},
          dmin: { type: Sequelize.FLOAT, allowNull: true, defaultValue:0},
          rms: { type: Sequelize.FLOAT, allowNull: true, defaultValue:0},
          gap: { type: Sequelize.FLOAT, allowNull: true, defaultValue:0},
          magType: { type: Sequelize.STRING, allowNull: true},
          type: { type: Sequelize.STRING, allowNull: true},
          title: { type: Sequelize.STRING, allowNull: false},
          geometry_type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          geometry_coordinates: {
            type: Sequelize.JSONB,
            allowNull: false,
          },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, allowNull: true },
        },{ transaction: t },
      );
      
    })
  },

  async down (queryInterface) {
    await queryInterface.sequelize.transaction(async t => {
        await queryInterface.dropTable("weather_stats", { transaction: t });
      });
  }
};
