import React = require('react');
import { ref, unref } from '../../service/loader';
import { ContextTypes } from '../../utils/traceDependencies';
type Props = {
  loader: (cb: Function) => void,
  // tslint:disable-next-line:no-any
  subProps: any,
  chunk: string,
}

type State = {
  // tslint:disable-next-line:no-any
  Component: any;
}

/**
 * 异步加载组件
 */
export default class LazyLoad extends React.Component<Props, State> {
  static contextTypes = ContextTypes;

  didMount: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      Component: null,
    };

    const { loader } = props;
    ref();
    // tslint:disable-next-line:no-any
    loader((c: any) => {
      if (c.default) c = c.default;
      if (this.didMount) {
        this.setState({
          Component: c
        })
      } else {
        this.state = {
          Component: c,
        };
      }
      unref();
    });
  }

  componentDidMount() {
    this.didMount = true;
  }

  render() {
    const { subProps, chunk } = this.props;
    if (this.context && this.context.dependences) {
      this.context.dependences[chunk] = true;
    }
    const { Component } = this.state;
    if (Component) {
      return <Component {...subProps}/>;
    } else {
      return null;
    }
  }
}
