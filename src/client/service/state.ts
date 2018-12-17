/// <reference path="../../declarations/state.d.ts" />
import React = require('react');
import { isPromise } from '../../server/lib/types';
import axios from 'axios';
const pendingMap: Map<string, Promise<PageStates>> = new Map();

let pageState: {
  [url: string]: PageStates;
} = {};

// 前端的页面状态会在 script 标签中保存，参见 src/erver/routes/Entry
// tslint:disable-next-line:no-any
if (typeof window !== 'undefined' && typeof (window as any).pageState !== 'undefined') {
  // tslint:disable-next-line:no-any
  pageState = (window as any).pageState;
}

/**
 * 设置页面状态，服务端渲染时需
 */
export function setPageState(pathname: string, state: PageStates) {
  pageState[pathname] = state;
}

function _getPageState(pathname: string): PageStates | Promise<PageStates> {
  if (pageState[pathname]) {
    return pageState[pathname];
  }
  if (typeof window === 'undefined') {
    return null;
  }
  const p = axios.get(`/state${pathname}`)
    .then(res => res.data)
    .then(state => {
      pageState[pathname] = state;
      pendingMap.delete(pathname);
      return state;
    }, err => {
      pendingMap.delete(pathname);
      throw err;
    });
  pendingMap.set(pathname, p);
  return p;
}

/**
 * 根据路径获取页面状态
 * 如果页面状态已经获取过一次，则直接返回
 * 否则则会发起 ajax 请求
 */
export function getPageState(
  // tslint:disable-next-line:no-any
  component: React.Component<any, { pageState: PageStates }>,
  pathname: string,
  cb?: (state: PageStates) => void,
  init: boolean = true,
) {
  const runCB = (_s: PageStates) => {
    if (cb) {
      if (typeof requestAnimationFrame === 'undefined') return;
      requestAnimationFrame(() => {
        cb(_s);
      })
    }
  };

  let p = pendingMap.get(pathname);
  if (!p) {
    const s = _getPageState(pathname);
    if (s && isPromise(s)) {
      s.then((_s: PageStates) => {
        component.setState({ pageState: _s });
        runCB(_s);
      });
    } else if (init) {
      // tslint:disable-next-line:no-any
      (component.state as any).pageState = s;
      runCB(s);
    } else {
      component.setState({ pageState: s });
      runCB(s);
    }
  } else {
    return p.then(() => _getPageState(pathname))
    .then((s: PageStates) => {
      component.setState({ pageState: s });
      runCB(s);
    })
  }
}
