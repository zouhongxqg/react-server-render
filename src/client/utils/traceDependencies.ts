import React = require('react');
import PropTypes = require('prop-types');

export const ContextTypes = {
  serverRending: PropTypes.bool,
  dependences: PropTypes.objectOf(PropTypes.bool),
}

export default <T>(Target: T): T => {
  class Context extends React.Component<{
    context: ServerRenderContext,
  }, void> {

    static childContextTypes = ContextTypes;

    getChildContext() {
      const context = {...this.context, ...this.props.context};
      return context;
    }
    render() {
      // tslint:disable-next-line:no-any
      return React.createElement(Target as any, this.props || {});
    }
  }
  // tslint:disable-next-line:no-any
  return Context as any;
}
