/**
 * User Schema
 * @access private
 * @version 0.0.1
 * @author [David Tolbert](npm.merlin@gmail.com)
 */

// Node Modules
import { resolver } from 'graphql-sequelize';
import { PubSub } from 'graphql-subscriptions';

// Sequelize Models
import { models } from '../models';

// Declarations
const pubsub = new PubSub();

// Schema
export const userSchema = `
  type User {
    id: ID!,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    accountType: String,
    online: Boolean,
    blocked: Boolean,
    deleted: Boolean,
    refreshToken: String
  }
`;

/**
 * Create user resolvers.
 */
export const userResolvers = () => {

  return {
    Query: {
      users: async (args, context) => {
        const users = models.User.findAll();
        pubsub.publish('usersChanged', { usersChanged: users });
        return users;
      },
    },
    Mutation: {
      async createAccount(_, args) {
        const user = await models.User.create({...args});        
        pubsub.publish('usersChanged', { usersChanged: models.User.findAll() });
        return user;
      },
      async deleteAccount(_, args) {
        console.log('delete account args >>', args);
        if(args.id) {
          const user = await models.User.destroy({
              where: {
                id: args.id
              }
            }
          );        
          pubsub.publish('usersChanged', { usersChanged: models.User.findAll() });
        }
        
        return user;
      },
    },
    Subscription: {
      usersChanged: {
        subscribe: () => {
          console.log('subscribed to usersChanged');
          return pubsub.asyncIterator('usersChanged');
        }
      }
    },
    User: {
      
    },
  };
};
