/// <reference path="../../declarations/state.d.ts" />

import { route, match } from './decorator';
import { Context } from 'koa';


const prefix = '/state';
export default class PageStageController {
  // tslint:disable-next-line:no-any
  getPageState(ctx: Context): any {
    const result = match(this, `${prefix}${ctx.path}`);
    if (result) {
      ctx.params = result.params;
      return result.fn.call(this, ctx);
    }
    return null;
  }

  @route('get', `${prefix}/`)
  async mian(ctx: Context) {
    // tslint:disable-next-line:no-console
    console.log(ctx);
    const searchResult = {title: 'homePage'};
    return searchResult;
  }

  @route('get', `${prefix}/*`)
  notFound() {
    return {};
  }
}
