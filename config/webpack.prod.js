'use strict';
const webpack = require('webpack')
const config = require('config');
const path = require('path');
const root = config.get('root'); // webpack want absolute path
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(root, './static'),
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          context: path.join(root, 'src', 'client'),
          name: '[path][name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          context: path.join(root, 'src', 'client'),
          name: '[path][name].[hash:7].[ext]'
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader?-minimize&-autoprefixer&importsLoader=1', 'postcss-loader']
        })
      }
    ]
  },
  entry: {
    app: [path.resolve(root, './src/client/main.tsx')]
  },
  plugins: [
    new ExtractTextPlugin({
      allChunks: true,
      filename: '[name].[contenthash:8].css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
});
module.exports = webpackConfig;
