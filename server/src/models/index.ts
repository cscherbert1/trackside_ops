import { Sequelize } from 'sequelize';
import sequelize from '../config/database';
import fs from 'fs';
import path from 'path';

const models: { [key: string]: any } = {};

const basename = path.basename(__filename);
const modelsDir = __dirname;

fs.readdirSync(modelsDir)
  .filter((file) => {
    return (
      file !== basename &&
      file.endsWith('.ts') &&
      !file.endsWith('.d.ts')
    );
  })
  .forEach((file) => {
    const model = require(path.join(modelsDir, file));
    const modelName = Object.keys(model)[0];
    models[modelName] = model[modelName];
  });

// If you ever define associations, you can do it here like:
// Object.values(models).forEach(model => model.associate?.(models));


const initDb = async () => {
  await sequelize.sync({ alter: true });
};

export { sequelize, initDb, models };
