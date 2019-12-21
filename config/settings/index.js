require('../init-dotenv');

const defaults = require('./default.js');

const env = process.env.NODE_ENV || 'development';
const config = require(`./${env}.js`);

module.exports = { ...defaults, ...config };
