/**
 * User Model (Sequelize)
 * @access private
 * @version 0.0.1
 * @author [David Tolbert](npm.merlin@gmail.com)
 */

// Node Modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Define user model.
 * @param {Object} sequelize - Sequelize instance.
 * @param {Object} DataTypes - Sequelize data types.
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      validate: { max: 100 },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: { max: 100 }, // TODO set maximum on more fields
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      validate: { min: 8, max: 50 },
    },
    accountType: {
      type: DataTypes.ENUM('admin', 'tester', 'pending', 'free', 'trial', 'customer', 'member'),
      defaultValue: 'pending',
    },
    online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  }, 
  {
    hooks: {
      beforeCreate: async function (user, options) {

        // Check password length.
        if(user.password && user.password.length < 8) {
          throw new Error('password must be 8 characters');
        }

        // Hash password.
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(user.password, salt);
          user.password = hash;
        }

        return Promise.resolve();
      },
    },
  });

  /**
   * Associate models.
   * @param {Object} m - Model associate.
   */
  User.associate = (m) => {
    //User.hasMany(m.Something, {});
  };

  // VALIDATORS

  /**
   * Validate user password
   * @param {string} password - User password
   */
  User.prototype.validPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  // GENERATORS

  /**
   * Generate login token.
   * @param {string} tokenSecret - Secret token for encryption.
   */
  User.prototype.generateLoginTokens = function(tokenSecret) {
    const { email, role, id } = this;
    const accessToken = jwt.sign({ email, role, id }, tokenSecret, { expiresIn: '20m' });
    const refreshToken = jwt.sign({ id }, tokenSecret, { expiresIn: '60d' });

    return Promise.all([accessToken, refreshToken]);
  };

  /**
   * Genrate activation token
   * @param {string} tokenSecret - Secret token for encryption.
   */
  User.prototype.generateActivationToken = function(tokenSecret) {
      const { id, email } = this;
      return jwt.sign({ id, email, activationToken: true }, tokenSecret, { expiresIn: '7d' });
  };

  return User;
};
