/// <reference path="../declarations/index.d.ts" />
import React = require('react');
import ReactDOM = require('react-dom');
import { setCb } from './service/loader';
import { getPageState } from './service/state';

function render() {
  const App = require('./App').default;
  const container = document.createElement('div');
  ReactDOM.render(
        <App context={{
          dependences: {},
        }} getPageState={getPageState}/>,
    container,
  );
  // 当所有异步组件都已加载完毕，再将渲染的结果插入 DOM
  setCb(() => {
    const app = document.getElementById('app')
    container.id = 'app';
    if (app && app.parentElement) {
      app.parentElement.replaceChild(container, app);
    }
  })
}

// webpack hot load
// tslint:disable-next-line:no-any
if ((module as any).hot) {
  // tslint:disable-next-line:no-any
  (module as any).hot.accept('./App', () => render())
}

document.addEventListener('DOMContentLoaded', () => {
  render();
});

const setRem = () => {
  let fontSize = 70;
  if (window.innerWidth <= 425) {
    fontSize = window.innerWidth / 320 * 70;
  }
  document.documentElement.style.fontSize = fontSize + 'px';
}

setRem();
window.addEventListener('resize', setRem);
