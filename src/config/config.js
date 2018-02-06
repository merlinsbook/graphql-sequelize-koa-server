/**
 * Server and database configurations
 * @access private
 * @version 0.0.1
 * @author [David Tolbert](npm.merlin@gmail.com)
 */

 // Modes
export const PRODUCTION_MODE = process.env.NODE_ENV === 'production';

// Database
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_NAME = process.env.DB_NAME || 'testDb';
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_USER = process.env.DB_USER || 'admin';
export const DB_PASS = process.env.DB_PASS || 'admin';
export const DROP_DATA = process.env.DROP_DATA || true;
export const QTY_TEST_DATASETS = 20;