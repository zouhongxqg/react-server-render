const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const config = require('config');
const root = config.get('root');
const rmrf = require('./rmrf');

/**
 * 构建客户端代码
 */
async function buildClientCode() {
  const webpackConfig = require(path.join(root, 'config/webpack.prod.js'));
  await new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, state) => {
      if (err) return reject(err);

      if (state.hasErrors() || state.hasWarnings()) {
        const info = state.toJson({
          chunks: false,
        });
        if (state.hasErrors()) {
          info.errors.forEach(e => {
            console.error('ERROR:', e); // 打印错误
          })
        }
        if (state.hasWarnings()) {
          info.warnings.forEach(warn => {
            console.warn('WARN:', warn); // 打印报警
          })
        }
        return reject(new Error('compile faild'));
      }

      // 将构建信息写入 buildMeta.json 文件中
      const result = state.toJson();
      fs.writeFileSync(
        path.join(root, 'buildMeta.json'),
        JSON.stringify({
          assets: result.assets,
          assetsByChunkName: result.assetsByChunkName
        })
      );
      resolve();
    });
  });
}

module.exports = buildClientCode;