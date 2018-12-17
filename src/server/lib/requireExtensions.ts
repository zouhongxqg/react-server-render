import path = require('path');
import config = require('config');
import fs = require('fs');
import React = require('react');
import LazyLoader from '../../client/components/LazyLoad';

type BuildMeta = {
  assets: {
    name: string,
  }[],
  assetsByChunkName: {
    [key: string]: string,
  },
}

const root = config.get('root') as string;
const webpackHost = config.get('webpack.host') as string;
const webpackPort = config.get('webpack.port') as string;
// const bsHost = config.get('buildService.host');
// const bsApp = config.get('buildService.app');

/**
 * 构建信息
 */
let buildMeta: BuildMeta | null = null;
if (!config.get('isDev')) {
  buildMeta = JSON.parse(
    fs.readFileSync(
      path.join(root, 'buildMeta.json')
    ).toString()
  ) as BuildMeta;
}

/**
 * 静态文件地址解析
 * @param ext 文件类型
 */
const assertResolver = (ext: string) => (m: NodeModule, filename: string) => {
  // tslint:disable-next-line:no-console
  let file = path
    .relative(path.join(root, 'src', 'client'), filename)
    .split(path.sep)
    .join('/');

  if (buildMeta) {
    const basename = path.basename(file, ext);
    const dirname = path.dirname(file);
    const asset = buildMeta.assets.find(
        a => a.name.indexOf(`${dirname}/${basename}`) === 0
      );
    if (asset) {
      file = asset.name;
    }
  }

  m.exports = fileResolver(`/static/${file}`);
  return m;
}

/**
 * webpack chunk 文件地址解析
 * @param chunk chunk 名称
 */
export const chunkResolver = (chunk: string) => {
  if (buildMeta) {
    const file = buildMeta.assetsByChunkName[chunk];
    if (file) {
      if (Array.isArray(file)) {
        return file.map(f => fileResolver(`/static/${f}`));
      } else {
        return fileResolver(`/static/${file}`);
      }
    }
  }
  return null;
}

/**
 * 文件引用地址
 * @param file 文件地址
 */
export function fileResolver(file: string) {
  if (config.get('isDev')) {
    return `//${webpackHost}:${webpackPort}${file}`;
  }
};

// 注册所有资源格式，在服务端渲染的时候，可以 require 文件
[
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.gif',
  '.scss',
].forEach(ext => {
  require.extensions[ext] = assertResolver(ext);
});

require.extensions['.async'] = (m: NodeModule, filename: string) => {
  const components = JSON.parse(fs.readFileSync(filename).toString()) as {
    [k: string]: string,
  };
  const result: {
    // tslint:disable-next-line:no-any
    [k: string]: any,
  } = {};

  Object.keys(components).forEach(k => {
    // tslint:disable-next-line:no-any
    result[k] = (props: any) => React.createElement(LazyLoader, {
      loader: (cb: Function) => cb(require(path.join(path.dirname(filename), components[k])).default),
      chunk: k,
      subProps: props,
    })
  });

  m.exports = {
    default: result,
  }
  return m;
}
