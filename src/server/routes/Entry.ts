/// <reference path="../../declarations/index.d.ts" />
import { Context } from 'koa';
import config = require('config');
import React = require('react');
import ReactDOMServer = require('react-dom/server');
import { fileResolver, chunkResolver } from '../lib/requireExtensions';
import App from '../../client/App';
import { setPageState } from '../../client/service/state';
import ServerError from '../lib/error';
import { route } from './decorator';
import PageState from './PageState';

export default class EntryController {

  pageState = new PageState();
  // tslint:disable-next-line:no-any
  scriptsTag(scripts: any): string {
    const scriptTag = (s: string): string => {
      if (s.match(/css$/)) {
        return `<link href="${s}" rel="stylesheet" type="text/css">`;
      } else {
        return `<script src="${s}" type="text/javascript"></script>`;
      }
    };
    if (Array.isArray(scripts)) {
      return scripts.map(s => scriptTag(s)).join('');
    }
    return scriptTag(scripts);
  }

  /**
   * web 首页
   */
  @route('get', '*')
  async index(ctx: Context) {
    if (!ctx.accepts('html')) {
      throw new ServerError({
        ignore: true,
        status: 406,
        message: 'Not Acceptable'
      });
    }

    // 主 js 文件
    const mainFile = chunkResolver('app') || fileResolver('/static/app.js');
    // 页面的状态
    const pageState = (await this.pageState.getPageState(ctx)) || null;
    let chunks: string[] = [];
    let appStr = '';
    // 服务端渲染页面
    if (config.get('serverRender')) {
      const context: ServerRenderContext = {
        dependences: {},
        serverRending: true
      };
      // 渲染之前设置页面状态
      setPageState(ctx.path, pageState);
      appStr = ReactDOMServer.renderToString(
        React.createElement(App, {
          url: ctx.url,
          context
        })
      );
      if (context.url) {
        ctx.redirect(context.url);
        return;
      }
      chunks = Object.keys(context.dependences);
    }

    const browserConfig = {};
    return `<html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <meta name="baidu-site-verification" content="tXNXqhkDKA" />
        <script>var config = ${JSON.stringify(browserConfig)}</script>
        <script>var pageState = ${JSON.stringify({
          [ctx.path]: pageState
        })}</script>
        ${this.scriptsTag(mainFile)}
        ${chunks
          .map(c => {
            const f = chunkResolver(c);
            if (!f) return null;
            return this.scriptsTag(f);
          })
          .filter(Boolean)
          .join('')}
      </head>
      <body>
        <div id="app">${appStr}</div>
      </body>
    </html>`;
  }
}
