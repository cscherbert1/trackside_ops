import sequelize from '../config/database';

// Import models directly
import { Layout } from './layout';
import { Location } from './location';
import { Track } from './track';
import { Commodity } from './commodity';
import { Car } from './car';
import  { Waybill } from './waybill';
import { Instruction } from './instruction';

// Collect models in one object (optional but handy)
const models = {
  Layout,
  Location,
  Track,
  Commodity,
  Waybill,
  Instruction,
  Car, 
};

// Define associations
Layout.hasMany(Location, { foreignKey: 'layoutId', onDelete: 'CASCADE' });
Location.belongsTo(Layout, { foreignKey: 'layoutId' });

Location.hasMany(Track, { foreignKey: 'locationId', onDelete: 'CASCADE' });
Track.belongsTo(Location, { foreignKey: 'locationId' });

Layout.hasMany(Commodity, { foreignKey: 'layoutId', onDelete: 'CASCADE' });
Commodity.belongsTo(Layout, { foreignKey: 'layoutId' });

Layout.hasMany(Waybill, { foreignKey: 'layoutId', onDelete: 'CASCADE'});
Waybill.belongsTo(Layout, { foreignKey: 'layoutId' });
Waybill.hasMany(Instruction, { foreignKey: 'waybillId', onDelete: 'CASCADE'});
Instruction.belongsTo(Waybill, { foreignKey: 'waybillId' });

Layout.hasMany(Car, { foreignKey: 'layoutId', onDelete: 'CASCADE' });
Car.belongsTo(Layout, { foreignKey: 'layoutId' });
Track.hasMany(Car, { foreignKey: 'trackId' });
Car.belongsTo(Track, { foreignKey: 'trackId' });



// Initialize the database
const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    // DO NOT sync if using migrations
    // await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, initDb, models };
