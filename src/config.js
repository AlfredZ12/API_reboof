module.exports = {
  HOST: process.env.HOST || 'http://localhost',
  PORT: process.env.PORT || 5000,
  MONGODB_HOST: process.env.MONGODB_HOST || 'localhost',
  MONGODB_DATABASE: process.env.MONGODB_DB || 'mongo'
};