/**
 * Test data generators [A-Z]
 * @access private
 * @version 0.0.1
 * @author [David Tolbert](npm.merlin@gmail.com)
 */

// Node Modules
import faker from 'faker';

// Config
import { QTY_TEST_DATASETS } from './config';

 /**
  * Generate test data.
  * @param {Array<object>} models - Available sequelize models.
  * @param {Object} faker - Fake data (npm faker).
  */
export const generateTestData = async(models) => {
  // Create some users.
  for(let i = 0; i < QTY_TEST_DATASETS; i += 1) {
    try {
      await createUser(models, 
        {
          email: faker.internet.email(),
          password: faker.internet.password(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          accountType: 'free',
          online: false,
          blocked: false,
          deleted: false,
          refreshToken: '',
        }
      );
    } catch(e) {
      
    }
  }
};  

/**
 * User
 * @param {Array<object>} models - Available sequelize models.
 * @param {Object} data - Data to fill in.
 */
export const createUser = async(models, data) => await models.User.create({...data});  


