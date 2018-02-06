/**
 * TEST SERVER
 * @access private
 * @version 0.0.1
 * @author [David Tolbert](npm.merlin@gmail.com)
 */

 // Node Modules
import http from 'http';

// Initializer
import { initEnviroment, initApp, createSubscriptionServer } from './server';

/**
 * Initialize app
 */
const init = async() => {

  const port = 3000;
  const enviroment = await initEnviroment();
  const app = await initApp();

  const server = http.createServer(app.callback());
  
  // Server
  server.listen(port, () => {
    createSubscriptionServer(server)
  });

  // Hot reload
  if (module.hot) {
    module.hot.accept('./server', () => {
      server.removeAllListeners('request', server);
      server.on('request', app.callback());
    });
  }

  console.log(`Server running on: http://localhost:${port}`);
}
init();

