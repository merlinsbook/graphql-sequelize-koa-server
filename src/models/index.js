/**
 * Sequelize Database Initalization.
 * @access private
 * @version 0.0.1
 * @author [David Tolbert](npm.merlin@gmail.com)
 */

// Node Modules
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

// Provisions: Fake Data
import { generateTestData } from '../config/provisions';

// Declarations
export let models = {};   // Sequelize models

/**
 * Database initialization
 * @param {string} url - Connection string
 * @param {Object} behavior - Behaviors.
 * @property {boolean} drop - Drops all tables on the given connection.
 */
export async function initializeDatabase(url, behavior) {

  // Get behaviors.
  const { drop } = behavior;

  try {

    // Initialize and test connection.
    const sequelize = new Sequelize(url, { console });
    await sequelize.authenticate();

    // Get and store all models from directory.
    fs.readdirSync(path.join(process.cwd(), 'src/models'))
      .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
      .map((file) => {
        const model = sequelize.import(path.join(process.cwd(), 'src/models', file));
        models[model.name] = model;
      });

    Object.values(models).map(model => ('associate' in model) && model.associate(models));

    // Create tables
    try {
      await sequelize.sync({ force: drop });
    } catch(e){
      throw e;
    }

    models.sequelize = sequelize;
    models.Sequelize = Sequelize;
    
    if(drop){
      // Create some test users
      generateTestData(models);
    }

    return models;

  } catch (err) {
    throw err;
  }
}
