export default {
  testEnvironment: 'node',
  transform: {},                           
  testMatch: ['**/tests/**/*.test.js'],
  forceExit: true,                       
  verbose: true,
  setupFiles: ['dotenv/config'],
};
