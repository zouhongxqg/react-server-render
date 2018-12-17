const config = require('config');
const root = config.get('root');
const path = require('path');

const buildServerCode = require('./lib/buildServerCode');
const startServer = require('./lib/startServer');
const cleanServerCode = require('./lib/cleanServerCode');
let started = false;

cleanServerCode()
.then(() => {
  return buildServerCode(() => {
    if (started) return;
    startServer();
    started = true;
  }, true);
})

