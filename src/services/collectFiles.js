const async = require('async');
const context = require('context');

async function fileExistInDb(filePath) {
  const { File } = context().models;

  const result = await File.where(
    'filepath', filePath,
  ).fetch({ require: false });

  return !!result;
}

async function saveInfoAboutFile(filePath) {
  const ctx = context();
  const { services } = ctx;
  const { File } = ctx.models;

  const fileBuffer = services.util.readFileBeginning(filePath);
  const fileSign = await services.util.createFileSign(fileBuffer);

  console.log('--- sign:', fileSign, 'file:', filePath);

  await File.forge({
    filepath: filePath,
    sign: fileSign,
  }).save();

  return null;
}

async function fileProcessor(filePath) {
  if (await fileExistInDb(filePath)) {
    console.log('--- file:', filePath, 'was already proccessed');
    return null;
  }

  return saveInfoAboutFile(filePath);
}

module.exports = async ({ dirpaths }) => (
  async.eachSeries(dirpaths, async (dirpath) => {
    const { services } = context();

    return services.util.processDirectory({
      dirpath,
      fileProcessor,
    });
  })
);
