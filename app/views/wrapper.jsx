/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');

var log = require('bows')('Wrapper View');

require('./app.scss');

var Wrapper = module.exports = React.createClass({
  displayName: 'Wrapper',
  render() {
    return (
      <div className="App">
        <header>
          <nav>
            nav
          </nav>
        </header>

        <div className="App-content">
          {this.props.children}
        </div>
      </div>
    );
  }
});
