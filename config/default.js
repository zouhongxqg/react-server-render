const path = require('path');
module.exports = {
  port: 8080,
  isDev: true,
  isProd: false,
  isMock: false, 
  // 是否开启服务端渲染
  serverRender: true,
  root: path.resolve(__dirname, '..'),
  webpack: {
    host: 'localhost',
    port: 8081
  },
};
