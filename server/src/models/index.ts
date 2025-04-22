import sequelize from '../config/database';

// Import models directly
import { Layout } from './layout';
import { Location } from './location';
import { Track } from './track';

// Collect models in one object (optional but handy)
const models = {
  Layout,
  Location,
  Track,
};

// Define associations
Layout.hasMany(Location, { foreignKey: 'layoutId', onDelete: 'CASCADE' });
Location.belongsTo(Layout, { foreignKey: 'layoutId' });

Location.hasMany(Track, { foreignKey: 'locationId', onDelete: 'CASCADE' });
Track.belongsTo(Location, { foreignKey: 'locationId' });

// Initialize the database
const initDb = async () => {
  await sequelize.sync({ alter: true }); // alter = preserve data and apply changes
};

export { sequelize, initDb, models };
