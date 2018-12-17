import Koa = require('koa');
import routes from './routes';
import bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());
app.use(routes);
app.proxy = true;

export default app;

