/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Icon = require('../base/components/icon');

var log = require('bows')('Wrapper View');

require('./app.scss');

var Wrapper = module.exports = React.createClass({
  displayName: 'Wrapper',
  render() {
    return (
      <div className="App">
        <header>
          <nav className="App-nav">
            <div className="App-nav-item">
              <Router.Link to="swipe">
                <Icon type="settings" font={false}/>
              </Router.Link>
            </div>
            <h1>Gitr</h1>
            <div className="App-nav-item App-nav-item--message">
              <Router.Link to="messages">
                <Icon type="bubble" className="App-nav-item" font={false}/>
              </Router.Link>
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
