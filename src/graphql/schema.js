/**
 * Graphql Schema
 * @access private
 * @version 0.0.1
 * @author [David Tolbert](npm.merlin@gmail.com)
 */

// Node Modules
import { makeExecutableSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';
import { JSONType } from 'graphql-sequelize';
import GraphQLDate from 'graphql-date';

// Utilities TODO: move this
import { combineResolvers } from '../_temp/utils';

// Model definitions
import { userSchema, userResolvers } from './user';

/**
 * Schema
 */
export default () => {

  const rootSchema = [`
    scalar JSON
    scalar Date
    scalar SequelizeJSON

    type Query {
      users(keyword:String): [User]
    }

    type Mutation {
      createAccount(email: String!, password: String!, firstName: String!, lastName: String!, accountType: String!): User
      deleteAccount(id: ID!): User
    }

    type Subscription {
      usersChanged: [User]
    }

    schema {
      query: Query
      mutation: Mutation
      subscription: Subscription
    }
  `];

  const rootResolver = {
    SequelizeJSON: JSONType,
    JSON: GraphQLJSON,
    Date: GraphQLDate,
  };

  const resolvers = combineResolvers([rootResolver, userResolvers()]);

  return makeExecutableSchema({
    typeDefs: [...rootSchema, userSchema],
    resolvers,
  });
}
