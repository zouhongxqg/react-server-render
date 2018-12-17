import * as config from 'config';
// tslint:disable:no-console

if (config.get('isDev')) {
  require('./dev-server');
} else {
  const port = config.get('port');
  require('./app').default.listen(port, () => {
    console.log('server is listen on port:', port);
  });
}
