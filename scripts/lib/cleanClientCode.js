const config = require('config');
const path = require('path');
const root = config.get('root');
const rmrf = require('./rmrf');

async function cleanServerCode() {

  await rmrf(path.join(root, 'static'));
  await rmrf(path.join(root, 'buildMeta.json'));
}

module.exports = cleanServerCode;