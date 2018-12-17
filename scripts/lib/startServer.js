const child_process = require('child_process');
const config = require('config');
const root = config.get('root');
const path = require('path');

function startServer() {
  const child = child_process.spawn('node', [path.join(root, 'src', 'server')]);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}

module.exports = startServer;