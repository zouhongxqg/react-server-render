const buildServerCode = require('./lib/buildServerCode');
const buildClientCode = require('./lib/buildClientCode');
const cleanServerCode = require('./lib/cleanServerCode');
const cleanClientCode = require('./lib/cleanClientCode');

async function build() {
  await Promise.all([buildClientCode(), buildServerCode()]);
}

cleanClientCode()
.then(cleanServerCode)
.then(build)
.then(() => {
  console.log('build done!');
  process.exit(0);
}, err => {
  console.error(err);
  process.exit(1);
})
