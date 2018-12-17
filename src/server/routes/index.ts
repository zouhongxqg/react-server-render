import Router = require('koa-router');

import './Entry';
import './PageState';

import { setRouter } from './decorator';

const router = new Router();
setRouter(router);
export default router.routes();
