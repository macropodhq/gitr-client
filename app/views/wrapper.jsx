/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Icon = require('../base/components/icon');

var log = require('bows')('Wrapper View');

require('./app.scss');

var Wrapper = module.exports = React.createClass({
  displayName: 'Wrapper',

  getLeftButton() {
    if (this.props.leftLink) {
      return (
        <Router.Link
          to={this.props.leftLink.to}
          params={this.props.leftLink.params || {}}
        >
          <Icon type={this.props.leftLink.iconType} font={false}/>
        </Router.Link>
      );
    } else {
      return;
    }
  },

  getRightButton() {
    if (this.props.rightLink) {
      return (
        <Router.Link
          to={this.props.rightLink.to}
          params={this.props.rightLink.params || {}}
        >
          <Icon type={this.props.rightLink.iconType} font={false}/>
        </Router.Link>
      );
    } else {
      return;
    }
  },

  render() {
    return (
      <div className="App">
        <header>
          <nav className="App-nav">
            <div className="App-nav-item">
              {this.getLeftButton()}
            </div>
            <h1>{this.props.heading || 'Gitr'}</h1>
            <div className="App-nav-item App-nav-item--message">
              {this.getRightButton()}
            </div>
          </nav>
        </header>

        <div className="App-content">
          {this.props.children}
        </div>
      </div>
    );
  }
});
