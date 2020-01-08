const _ = require('lodash');
const context = require('context');

module.exports = async (argv) => {
  const { services } = context();

  return services.removeDoublesInDirectory({
    dirpath: argv.dirpath,
  });
};
