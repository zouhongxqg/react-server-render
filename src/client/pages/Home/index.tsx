import React = require('react');
import { RouteComponentProps } from 'react-router';
import './index.scss';
import { getPageState } from '../../service/state';

type Props = RouteComponentProps<void> & {}

type State = {
  pageState: HomePageState | null,
}

export default class HomePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      pageState: null,
    }

    getPageState(this, props.location.pathname)
  }
  render() {
    const pageState = this.state.pageState && this.state.pageState.title;
    return <div className="HomePage">hello world{pageState}</div>
}
}
