import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Mera Store render error', error, info);
  }

  reset = () => {
    this.setState({ hasError: false });
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return <main className="page error-page"><div className="empty-state"><p className="eyebrow">A small interruption</p><h1>That view needs another look.</h1><p>We could not render this page safely. Return home and continue browsing the Mera Store edit.</p><button className="button" onClick={this.reset}>Return home</button></div></main>;
    }
    return this.props.children;
  }
}
