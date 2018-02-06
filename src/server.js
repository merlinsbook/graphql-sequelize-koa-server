/**
 * TEST SERVER
 * @access private
 * @version 0.0.1
 * @author [David Tolbert](npm.merlin@gmail.com)
 */

 // Node Modules
import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaBody from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

// Database
import { initializeDatabase } from './models/index';
import { PRODUCTION_MODE, DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER, DROP_DATA } from './config/config';

// Grapqhl Schema
import getSchema from './graphql/schema';
const schema = getSchema();

/**
 * Enviroment initializations
 */
export const initEnviroment = async() => {
  initializeDatabase(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, { drop: DROP_DATA });
}

/**
 * App initialization
 */
export const initApp = async() => {
  
  const app = new Koa();
  const router = new KoaRouter();

  // Middlewares
  app.use(compress())  
    .use(cors({ origin: '*' })) // cors needs to be at the beginning
    .use(helmet())
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods());

  // Routes
  router.post('/graphql', graphqlKoa({ schema }));
  router.get('/graphql', graphqlKoa({ schema }));
  router.get('/graphiql', graphiqlKoa({
      endpointURL: '/graphql', // a POST endpoint that GraphiQL will make the actual requests to
      subscriptionsEndpoint: `ws://localhost:3000/subscriptions`
    }),
  );

  return app;
}

/**
 * Subscription server initialization
 * Wrap the Koa/Express server while passing the server as argument
 * @param {Object} server - http server instance
 */
export const createSubscriptionServer = (server) => {
  return (
    new SubscriptionServer({
      execute,
      subscribe,
      schema
    }, {
      server,
      path: '/subscriptions',
    })
  );
}
  