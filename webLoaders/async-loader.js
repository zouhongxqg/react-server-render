const config = require('config');
const root = config.get('root');
const path = require('path');

function parseComponent(chunk, path) {
  return `
  function(props) {
    return React.createElement(Lazy, {
      loader: function(cb) {
        require.ensure([], function() {
          cb(require("${path}"));
        }, "${chunk}");
      },
      subProps: props,
      chunk: "${chunk}",
    })
  }
  `;
}

function loader(content) {
  const routes = JSON.parse(content);
  const routeStr = [];
  for (let [key, path] of Object.entries(routes)) {
    routeStr.push(key, ":", parseComponent(key, path), ',');
  }
  let lazyLoadPath =
    path.relative(this.context,
      path.join(root, 'src', 'client', 'components', 'LazyLoad')
    ).replace(/\\/g, '/');
  if (!lazyLoadPath.match(/^\.\./)) {
    lazyLoadPath =  `./${lazyLoadPath}`;
  }
  return `
  var React = require('react');
  var Lazy = require("${lazyLoadPath}").default;
  module.exports = {
    default: {${routeStr.join('')}},
    __esModule: true,
  };
  `;
}

module.exports = loader;
