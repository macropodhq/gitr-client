/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');

var log = require('bows')('App View');

require('./app.scss');

var App = module.exports = React.createClass({
	displayName: 'App',

  render() {
    return (
      <div className="App">
        <Router.RouteHandler {...this.props} />
      </div>
    );
  }
});
