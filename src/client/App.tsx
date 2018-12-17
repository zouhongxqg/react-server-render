/// <reference path="../declarations/state.d.ts" />
import React = require('react');
import { Route, Router, StaticRouter } from 'react-router';
import { createBrowserHistory, History } from 'history'
import traceDependencies from './utils/traceDependencies';
import AsyncComponents from './routes.async';
import { Switch } from 'react-router-dom';
import './App.scss';
let history: History | null = null;
type Props = {
  url?: string,
  context: ServerRenderContext,
}

@traceDependencies
export default class App extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  renderRoutes() {
    return <div id="app-container">
      <Switch>
        <Route path="/" exact component={AsyncComponents.HomePage} />
        <Route path="/softProducts" component={AsyncComponents.SoftProductsPage} />
      </Switch>
    </div>;
  }

  render() {
    const { url, context } = this.props;
    // 服务端渲染
    if (context.serverRending) {
      return <StaticRouter location={url} context={context}>
        {this.renderRoutes()}
      </StaticRouter>;
    }

    if (!history) {
      history = createBrowserHistory();
      history.listen((location, action) => {
        location; action;
        if (action !== 'POP') {
        }
        if ((location.pathname.indexOf('/productGuide') >= 0) ||
            location.pathname.match(/FAQ\/\d.*/)) {
          return
        } else {
          requestAnimationFrame(() => {
            window.scrollTo(0, 0);
          })
        }
      })
    }

    return <Router history={history}>
      {this.renderRoutes()}
    </Router>;
  }
}
