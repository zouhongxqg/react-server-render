const config = require('config');
const path = require('path');
const root = config.get('root');
const rmrf = require('./rmrf');

async function cleanServerCode() {

  await rmrf(path.join(root, 'src'), filename => {
    if (filename.match(/thrift.*\.js/) || filename.match(/nolib\/.*\.js/)) return false;
    return filename.match(/(.js|.js.map)$/);
  });
}

module.exports = cleanServerCode;