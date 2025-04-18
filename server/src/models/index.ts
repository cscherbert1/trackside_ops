import sequelize from '../config/database';
import Layout from './layout';

const initDb = async () => {
  await sequelize.sync({ alter: true });
};

export { sequelize, Layout, initDb };
