'use strict';
const webpack = require('webpack')
const config = require('config');
const path = require('path');
const root = config.get('root'); // webpack want absolute path
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');

const host = config.get('webpack.host');
const port = config.get('webpack.port');

const webpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: [
      path.resolve(root, './src/client/main.tsx'),
      'webpack/hot/dev-server',
      `webpack-dev-server/client?http://${host}:${port}`,
    ],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          context: path.join(root, 'src', 'client'),
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          context: path.join(root, 'src', 'client'),
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader?-minimize&-autoprefixer&importsLoader=1',
          'postcss-loader',
        ],
      },
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(root, './static'),
    publicPath: `//${host}:${port}/static/`,
  },
  devtool: 'source-map',
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
  ],
});
module.exports = webpackConfig;
